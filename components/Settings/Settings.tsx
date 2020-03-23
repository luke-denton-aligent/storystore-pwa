import React, { FunctionComponent, useCallback, Reducer, useReducer } from 'react'
import { Root, Buttons, Title, Overrides, Details, Label, Value } from './Settings.styled'
import { setCookie, getCookie } from '../../lib/cookies'
import { SETTINGS_OVERRIDE_COOKIE } from '../../lib/overrideFromCookie'

import { version } from '../../package.json'
import { version as lumaUIVersion } from '@pmet-public/luma-ui/package.json'
import { useSettings } from './useSettings'
import { useAppContext } from '@pmet-public/luma-ui/dist/AppProvider'

import Form, { Input } from '@pmet-public/luma-ui/dist/components/Form'
import Loader from '@pmet-public/luma-ui/dist/components/Loader'
import Button from '@pmet-public/luma-ui/dist/components/Button'

export type SettingsProps = {
    defaults: {
        MAGENTO_URL?: string
        HOME_PAGE_ID?: string
        CATEGORIES_PARENT_ID?: string
        FOOTER_BLOCK_ID?: string
        GOOGLE_MAPS_API_KEY?: string
    }
}

type ReducerState = {
    MAGENTO_URL?: string
    HOME_PAGE_ID?: string
    CATEGORIES_PARENT_ID?: string
    FOOTER_BLOCK_ID?: string
    GOOGLE_MAPS_API_KEY?: string
}

type ReducerActions = {
    type: 'save'
    payload: ReducerState
}

const initialState: ReducerState = process.browser ? JSON.parse(getCookie(SETTINGS_OVERRIDE_COOKIE) ?? '{}') : {}

const reducer: Reducer<ReducerState, ReducerActions> = (state, action) => {
    switch (action.type) {
        case 'save':
            return {
                ...state,
                ...action.payload,
            }

        default:
            throw `Reducer action not valid.`
    }
}

export const Settings: FunctionComponent<SettingsProps> = ({ defaults }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const { toast } = useAppContext()

    const { data, loading, refetch } = useSettings()

    const handleSaveOverrides = useCallback(
        payload => {
            try {
                dispatch({ type: 'save', payload })

                const values: any = {}

                Object.keys(payload).forEach(key => {
                    const value = payload[key]
                    if (value) values[key] = value
                })

                setCookie(SETTINGS_OVERRIDE_COOKIE, JSON.stringify(values), 365)

                localStorage.clear()

                refetch() // fetch new data

                toast.success('Saved!')
            } catch (e) {
                console.error(e)
                toast.error('Oops! There was an issue. Try again.')
            }
        },
        [dispatch]
    )

    return (
        <React.Fragment>
            <Root>
                <Details>
                    {loading || !data?.storeConfig ? (
                        <Loader arial-label="loading server details" />
                    ) : (
                        <React.Fragment>
                            <Label>Version</Label>
                            <Value>
                                {version} / Storybook {lumaUIVersion}
                            </Value>

                            <Label>Store ID</Label>
                            <Value>{data.storeConfig.id}</Value>

                            <Label>Base URL</Label>
                            <Value>{data.storeConfig.baseUrl}</Value>

                            <Label>Locale</Label>
                            <Value>{data.storeConfig.locale}</Value>
                        </React.Fragment>
                    )}
                </Details>

                <Overrides>
                    <Title>Overrides</Title>
                    <Form autoComplete="false" onSubmit={handleSaveOverrides}>
                        <Input
                            name="MAGENTO_URL"
                            label="Magento URL"
                            defaultValue={state.MAGENTO_URL}
                            placeholder={defaults.MAGENTO_URL}
                            rules={{}}
                            style={{ textOverflow: 'ellipsis' }}
                        />

                        <Input
                            name="HOME_PAGE_ID"
                            label="Home Page ID"
                            defaultValue={state.HOME_PAGE_ID}
                            placeholder={defaults.HOME_PAGE_ID}
                            style={{ textOverflow: 'ellipsis' }}
                        />

                        <Input
                            name="CATEGORIES_PARENT_ID"
                            label="Categories Parent ID"
                            defaultValue={state.CATEGORIES_PARENT_ID}
                            placeholder={defaults.CATEGORIES_PARENT_ID}
                            style={{ textOverflow: 'ellipsis' }}
                        />

                        <Input
                            name="FOOTER_BLOCK_ID"
                            label="Footer Block ID"
                            defaultValue={state.FOOTER_BLOCK_ID}
                            placeholder={defaults.FOOTER_BLOCK_ID}
                            style={{ textOverflow: 'ellipsis' }}
                        />

                        <Input
                            name="GOOGLE_MAPS_API_KEY"
                            label="Google Maps API Key"
                            defaultValue={state.GOOGLE_MAPS_API_KEY}
                            placeholder={defaults.GOOGLE_MAPS_API_KEY}
                            style={{ textOverflow: 'ellipsis' }}
                        />

                        <Buttons>
                            <Button type="submit">Save Changes</Button>
                        </Buttons>
                    </Form>
                </Overrides>
            </Root>
        </React.Fragment>
    )
}
