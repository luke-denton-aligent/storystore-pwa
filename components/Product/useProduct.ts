import { useCallback, useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'

import PRODUCT_QUERY from './graphql/product.graphql'
import ADD_SIMPLE_PRODUCTS_TO_CART_MUTATION from './graphql/addSimpleProductsToCart.graphql'
import ADD_CONFIGURABLE_PRODUCTS_TO_MUTATION from './graphql/addConfigurableProductsToCart.graphql'

type ProductVariant =
    | {
          variantSku?: string
          price: {
              regular: {
                  amount: {
                      currency: string
                      value: number
                  }
              }
          }
          specialPrice: number
          stock: string
          gallery: {
              id: number
              file: string
              label: string
              type: string
          }
      }
    | undefined

type OptionsAndVariants = {
    options?: any[]
    variants?: any[]
    key?: number
}

export const useProduct = (props: { sku: string }) => {
    const { sku } = props

    const { data, ...restQuery } = useQuery(PRODUCT_QUERY, {
        variables: { sku },
        fetchPolicy: 'cache-first',
        returnPartialData: true,
    })

    const { products, ...restData } = data || {}

    const product = products && products.items[0]

    const [optionsAndVariants, setOptionsAndVariants] = useState<OptionsAndVariants>({})

    const [productVariant, setProductVariant] = useState<ProductVariant>()

    /**
     * Fix Options Data
     */
    useEffect(() => {
        if (!product) return

        const variants =
            product.variants &&
            product.variants.reduce((accumVariants: [], currentVariant: any) => {
                return [
                    ...accumVariants,
                    currentVariant.attributes.reduce((accumAttributes: {}, currentAttribute: any) => {
                        const { code, value } = currentAttribute
                        return { ...accumAttributes, [code]: value, product: currentVariant.product }
                    }, {}),
                ]
            }, [])

        const options =
            product.options &&
            product.options
                .sort((a: any, b: any) => b.position - a.position)
                .map((option: any) => {
                    const { id, label, code, items } = option
                    const type = code === 'color' ? 'thumb' : 'text'

                    return {
                        id,
                        type,
                        label,
                        code,
                        items: items.map((item: any) => {
                            const disabled = item.stock !== 'IN_STOCK'

                            const { id, value, label } = item

                            const { product } = variants.find((x: any) => x.color === value) || {}

                            return {
                                id,
                                value,
                                label,
                                disabled,
                                image: product && product.thumbnail,
                            }
                        }),
                    }
                })

        setOptionsAndVariants({ options, variants, key: Date.now() })
    }, [product && product.id])

    /**
     * Handle Select Option
     */

    const handleSelectVariant = useCallback(
        (options: { [code: string]: string }) => {
            if (!product || !optionsAndVariants.variants) return

            const optionsList = Object.keys(options)

            const variant = optionsAndVariants.variants.find(v => {
                return optionsList.reduce((accum: boolean, code) => {
                    return v[code] == options[code] && accum
                }, true)
            })

            if (variant) {
                const { variantSku, price, gallery, specialPrice, stock } = variant.product
                setProductVariant({ variantSku, price, gallery, specialPrice, stock })
            }
        },
        [product && product.sku, optionsAndVariants.key]
    )

    /**
     * Handle Add To Cart Simple Product
     */
    const [addSimpleProductsToCart, { loading: addingSimpleProductToCart }] = useMutation(
        ADD_SIMPLE_PRODUCTS_TO_CART_MUTATION,
        {
            update(cache, { data: { addToCart } }) {
                const { cart } = addToCart
                cache.writeData({
                    data: { cart },
                })
            },
        }
    )

    const handleAddSimpleProductToCart = useCallback(async (variables: { sku: string; quantity: number }) => {
        const { sku, quantity } = variables
        const { data } = await addSimpleProductsToCart({
            variables: {
                cartId: '', // @client
                sku,
                quantity,
            },
        })
        return data
    }, [])

    /**
     * Handle Add To Cart Configurable Product
     */
    const [addConfigurableProductsToCart, { loading: addingConfigurableProductsToCart }] = useMutation(
        ADD_CONFIGURABLE_PRODUCTS_TO_MUTATION,
        {
            update(cache, { data: { addToCart } }) {
                const { cart } = addToCart

                cache.writeData({
                    data: { cart },
                })
            },
        }
    )

    const handleAddConfigurableProductToCart = useCallback(
        async (variables: { quantity: number; sku: string; variantSku: string }) => {
            const { sku, variantSku, quantity } = variables

            const data = await addConfigurableProductsToCart({
                variables: {
                    cartId: '', // @client
                    parentSku: sku,
                    sku: variantSku,
                    quantity,
                },
            })
            console.log({ data })
        },
        []
    )

    return {
        ...restQuery,
        data: {
            ...restData,
            product: {
                ...product,
                ...productVariant,
                options: optionsAndVariants.options,
                variants: optionsAndVariants.variants,
            },
        },
        addingToCart: addingSimpleProductToCart || addingConfigurableProductsToCart,
        api: {
            selectVariant: handleSelectVariant,
            addSimpleProductToCart: handleAddSimpleProductToCart,
            addConfigurableProductToCart: handleAddConfigurableProductToCart,
        },
    }
}
