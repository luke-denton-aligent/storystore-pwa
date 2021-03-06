import React, { FunctionComponent, useCallback, useState, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import {
    Root,
    Wrapper,
    Images,
    Image,
    Carousel,
    CarouselItem,
    GalleryGrid,
    InfoWrapper,
    InfoInnerWrapper,
    InfoOptions,
    Field,
    Info,
    Header,
    Title,
    Sku,
    Buttons,
    ShortDescription,
    Description,
    CarouselWrapper,
} from './Product.styled'

import { useRouter } from 'next/router'
import { useProduct } from './useProduct'
import useNetworkStatus from '~/hooks/useNetworkStatus'
import { resolveImage } from '~/lib/resolveImage'

import Head from '~/components/Head'
import Link from '~/components/Link'
import { ProductDetailsSkeleton } from './ProductDetails.skeleton'
import { ProductImageSkeleton } from './ProductImage.skeleton'
import Price from '@storystore/ui/dist/components/Price'
import Button from '@storystore/ui/dist/components/Button'
import Breadcrumbs from '@storystore/ui/dist/components/Breadcrumbs'
import Form, { Input, Select } from '@storystore/ui/dist/components/Form'
import { useStoryStore } from '~/hooks/useStoryStore/useStoryStore'
import TextSwatches from '@storystore/ui/dist/components/Form/TextSwatches'
import ThumbSwatches from '@storystore/ui/dist/components/Form/ThumbSwatches'
import ColorSwatches from '@storystore/ui/dist/components/Form/ColorSwatches'
import PageBuilder from '~/components/PageBuilder'

const ProductCarousel = dynamic(() => import('@storystore/ui/dist/components/ProductCarousel'), { ssr: false })

const ErrorComponent = dynamic(() => import('~/components/Error'))

export type ProductProps = {
    urlKey: string
}

type SelectedOptions = {
    [code: string]: string
}

export const Product: FunctionComponent<ProductProps> = ({ urlKey }) => {
    const { cartId } = useStoryStore()

    const { queries, api } = useProduct({ urlKey })

    const history = useRouter()

    const online = useNetworkStatus()

    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

    const { store, product } = queries.product.data || {}

    const categoryUrlSuffix = store?.categoryUrlSuffix ?? ''

    const productUrlSuffix = store?.productUrlSuffix ?? ''

    const handleOnChange = useCallback(
        (values: { options: { [key: string]: string } }) => {
            const options = Object.entries(values.options).reduce((accum, option) => {
                return option[1]
                    ? {
                          ...accum,
                          [option[0]]: option[1],
                      }
                    : { ...accum }
            }, {})

            setSelectedOptions(options)

            api.selectVariant(options)
        },
        [api]
    )

    const handleAddToCart = useCallback(async () => {
        if (!product || !cartId) return

        const { type, sku, variantSku } = product

        try {
            if (type === 'ConfigurableProduct') {
                await api.addConfigurableProductToCart({ cartId, sku, variantSku, quantity: 1 })
            } else if (type === 'SimpleProduct') {
                await api.addSimpleProductToCart({ cartId, sku, quantity: 1 })
            } else {
                throw Error('Product type not supported')
            }

            await history.push('/cart')
            window.scrollTo(0, 0)
        } catch (error) {
            console.error(error)
        }
    }, [api, product, history, cartId])

    const infoRef = useRef<HTMLDivElement>(null)

    /**
     * Scroll to top if there are any errors
     */
    const handleOnErrors = useCallback(
        errors => {
            if (Object.entries(errors).length > 0 && infoRef.current) {
                infoRef.current.scrollIntoView({ behavior: 'smooth' })
            }
        },
        [infoRef]
    )

    const gallery = useMemo(() => {
        return product?.gallery
            ?.filter((x: any) => x.type === 'ProductImage')
            .map(({ label, url }: any) => ({
                alt: label || product?.title,
                src: {
                    desktop: resolveImage(url, { width: 1260 }),
                    mobile: resolveImage(url, { width: 960 }),
                },
            }))
            .sort((a: any, b: any) => a.position - b.position)
    }, [product])

    if (!online && !product) return <ErrorComponent type="Offline" fullScreen />

    if (!queries.product.loading && !product) {
        return (
            <ErrorComponent type="404" button={{ text: 'Search', as: Link, href: '/search' }}>
                We&apos;re sorry, we coudn&apos;t find the product.
            </ErrorComponent>
        )
    }

    // Pending support of other Product Types
    if (product?.type && product.type !== 'ConfigurableProduct' && product.type !== 'SimpleProduct') {
        return <ErrorComponent type="500">Product type: {product.type} not supported.</ErrorComponent>
    }

    return (
        <React.Fragment>
            {product && <Head title={product.metaTitle || product.title} description={product.metaDescription} keywords={product.metaKeywords} />}

            <Root>
                <Form onSubmit={handleAddToCart} onValues={handleOnChange} onErrors={handleOnErrors}>
                    <Wrapper>
                        <Images>
                            {/* Mobile Gallery Carousel */}
                            <Carousel gap={1} padding={3} show={1} snap hideScrollBar>
                                {gallery ? (
                                    gallery.map((image: any, index: number) => (
                                        <CarouselItem key={index}>
                                            <Image {...image} height={1580} width={1274} vignette />
                                        </CarouselItem>
                                    ))
                                ) : (
                                    <CarouselItem>
                                        <ProductImageSkeleton />
                                    </CarouselItem>
                                )}
                            </Carousel>

                            {/* Tablet and Desktop Gallery Grid */}
                            <GalleryGrid>
                                {gallery ? (
                                    gallery.map((image: any, index: number) => (
                                        <CarouselItem key={index}>
                                            <Image {...image} height={1580} width={1274} vignette />
                                        </CarouselItem>
                                    ))
                                ) : (
                                    <>
                                        <CarouselItem>
                                            <ProductImageSkeleton />
                                        </CarouselItem>
                                        <CarouselItem>
                                            <ProductImageSkeleton />
                                        </CarouselItem>
                                        <CarouselItem>
                                            <ProductImageSkeleton />
                                        </CarouselItem>
                                    </>
                                )}
                            </GalleryGrid>
                        </Images>

                        <InfoWrapper ref={infoRef}>
                            <InfoInnerWrapper>
                                <Info>
                                    {queries.product.loading && !product ? (
                                        <ProductDetailsSkeleton style={{ width: '56rem', minWidth: '100%', maxWidth: '100%' }} />
                                    ) : (
                                        <React.Fragment>
                                            <Header>
                                                {product.categories && (
                                                    <Breadcrumbs
                                                        prefix="#"
                                                        items={product.categories
                                                            .slice(0, 4) // limit to 3
                                                            .filter((x: any) => !!x.href)
                                                            .map(({ id, mode, text, href }: any) => ({
                                                                _id: id,
                                                                as: Link,
                                                                urlResolver: {
                                                                    type: 'CATEGORY',
                                                                    id,
                                                                    mode,
                                                                },
                                                                href: '/' + href + categoryUrlSuffix,
                                                                text,
                                                            }))}
                                                    />
                                                )}

                                                <Title>{product.title}</Title>

                                                <Price
                                                    label={product.price.maximum.regular.value > product.price.minimum.regular.value ? 'Starting at' : undefined}
                                                    regular={product.price.minimum.regular.value}
                                                    special={product.price.minimum.discount.amountOff && product.price.minimum.final.value - product.price.minimum.discount.amountOff}
                                                    currency={product.price.minimum.regular.currency}
                                                />
                                                {product.sku && <Sku>SKU. {product.sku}</Sku>}
                                            </Header>

                                            {product.shortDescription?.html && <ShortDescription dangerouslySetInnerHTML={{ __html: product.shortDescription.html }} />}

                                            {product.options && (
                                                <InfoOptions>
                                                    {product.options
                                                        .map(({ id, type, label, required = true, code, items }: any) => {
                                                            const selected = items.find((x: any) => {
                                                                return code === x.code || x.value.toString() === selectedOptions[code]
                                                            })

                                                            return {
                                                                _id: id,
                                                                type,
                                                                swatches: {
                                                                    label: selected ? `${label}: ${selected.label}` : label,
                                                                    name: `options.${code}`,
                                                                    rules: { required },
                                                                    items: items?.map(({ id, label, value, swatch }: any) => {
                                                                        return {
                                                                            _id: id,
                                                                            label,
                                                                            type: 'radio',
                                                                            value,
                                                                            color: swatch?.color,
                                                                            image: swatch?.image && {
                                                                                alt: label || '',
                                                                                src: resolveImage(swatch.image, {
                                                                                    width: 200,
                                                                                }),
                                                                                width: 160,
                                                                                height: 198,
                                                                            },
                                                                        }
                                                                    }),
                                                                },
                                                            }
                                                        })
                                                        .sort((a: any, b: any) => b.position - a.position)
                                                        .map(({ _id, type, swatches }: any, index: number) => {
                                                            return (
                                                                <fieldset key={_id || index}>
                                                                    <Field>
                                                                        {type === 'TextSwatchData' && <TextSwatches {...swatches} />}
                                                                        {type === 'ImageSwatchData' && <ThumbSwatches {...swatches} />}
                                                                        {type === 'ColorSwatchData' && <ColorSwatches {...swatches} />}
                                                                        {type === undefined && <Select {...swatches} />}
                                                                    </Field>
                                                                </fieldset>
                                                            )
                                                        })}
                                                </InfoOptions>
                                            )}

                                            <Buttons>
                                                <Button
                                                    as="button"
                                                    text={product.stock === 'IN_STOCK' ? 'Add to Cart' : 'Sold Out'}
                                                    disabled={!cartId || product.stock === 'OUT_OF_STOCK'}
                                                    loading={api.addingSimpleProductsToCart.loading || api.addingConfigurableProductToCart.loading}
                                                />
                                            </Buttons>

                                            <Input type="hidden" name="quantity" value={1} rules={{ required: true }} />
                                            {product?.description?.html && <Description as={PageBuilder} html={product.description.html} />}
                                        </React.Fragment>
                                    )}
                                </Info>
                            </InfoInnerWrapper>
                        </InfoWrapper>
                    </Wrapper>
                </Form>
                {/* Related Products */}
                {product?.related?.length > 0 && (
                    <CarouselWrapper>
                        <Title>Related Products</Title>
                        <ProductCarousel
                            loading={queries.product.loading && !product?.related}
                            items={product.related.map(({ id, title, urlKey, image, price, options }: any) => ({
                                _id: id,
                                title: {
                                    text: title,
                                },
                                as: Link,
                                href: `/${urlKey}${productUrlSuffix}`,
                                urlResolver: {
                                    type: 'PRODUCT',
                                    urlKey,
                                },
                                image: {
                                    alt: image.alt,
                                    src: {
                                        desktop: resolveImage(image.src, { width: 1260 }),
                                        mobile: resolveImage(image.src, { width: 960 }),
                                    },
                                },
                                price: {
                                    label: price.maximum.regular.value > price.minimum.regular.value ? 'Starting at' : undefined,
                                    regular: price.minimum.regular.value,
                                    special: price.minimum.discount.amountOff && price.minimum.final.value - price.minimum.discount.amountOff,
                                    currency: price.minimum.regular.currency,
                                },
                                colors: options
                                    ?.find(({ items }: any) => !!items.find(({ swatch }: any) => swatch.__typename === 'ColorSwatchData'))
                                    ?.items.map(({ label, swatch }: any) => ({ label, value: swatch.value })),
                            }))}
                        />
                    </CarouselWrapper>
                )}

                {/* Upsell Products */}
                {product?.upsell?.length > 0 && (
                    <CarouselWrapper>
                        <Title>You may also like</Title>
                        <ProductCarousel
                            loading={queries.product.loading && !product?.upsell}
                            items={product.upsell.map(({ title, urlKey, image, price, options }: any) => ({
                                title: {
                                    text: title,
                                },
                                as: Link,
                                href: `/${urlKey}${productUrlSuffix}`,
                                urlResolver: {
                                    type: 'PRODUCT',
                                    urlKey,
                                },
                                image: {
                                    alt: image.alt,
                                    src: {
                                        desktop: resolveImage(image.src, { width: 1260 }),
                                        mobile: resolveImage(image.src, { width: 960 }),
                                    },
                                },
                                price: {
                                    label: price.maximum.regular.value > price.minimum.regular.value ? 'Starting at' : undefined,
                                    regular: price.minimum.regular.value,
                                    special: price.minimum.discount.amountOff && price.minimum.final.value - price.minimum.discount.amountOff,
                                    currency: price.minimum.regular.currency,
                                },
                                colors: options
                                    ?.find(({ items }: any) => !!items.find(({ swatch }: any) => swatch.__typename === 'ColorSwatchData'))
                                    ?.items.map(({ label, swatch }: any) => ({ label, value: swatch.value })),
                            }))}
                        />
                    </CarouselWrapper>
                )}
            </Root>
        </React.Fragment>
    )
}
