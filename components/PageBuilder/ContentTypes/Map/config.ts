import dynamic from 'next/dynamic'
import { getStyleAsObject } from '../../lib/getStyleAsObject'
import { getCookie } from '../../../../lib/cookies'

const component = dynamic(() => import('.'))

type Location = {
    record_id: number
    location_name: string
    country: string
    position: {
        longitude: number
        latitude: number
    }
    comment: string
    phone: string
    address: string
    city: string
    state: string
    zipcode: string
}

const props = (elem: HTMLElement) => {
    const style = getStyleAsObject(elem.style)

    const locations = JSON.parse(elem.dataset.locations as string).map((location: Location) => {
        const {
            record_id: _id,
            location_name: name,
            country: _country,
            position: { longitude: lng, latitude: lat },
            comment,
            phone,
            address,
            city,
            state,
            zipcode: zipCode,
        } = location

        const country = Array.isArray(_country) ? _country.join(' ') : _country

        return {
            _id,
            name,
            lng,
            lat,
            country,
            comment,
            phone,
            address,
            city,
            state,
            zipCode,
        }
    })

    const controls = elem.dataset.showControls === 'true'

    return {
        apiKey: process.browser && (getCookie('GOOGLE_MAPS_API_KEY') || process.env.GOOGLE_MAPS_API_KEY),
        locations,
        controls,
        style,
    }
}

export default { component, props }
