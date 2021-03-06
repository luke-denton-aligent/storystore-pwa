import { createGlobalStyle } from 'styled-components'

export const FontStyles = createGlobalStyle`
    @font-face {
        font-family: 'source-sans-pro';
        src: url('https://use.typekit.net/af/61f808/00000000000000003b9b3d63/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/61f808/00000000000000003b9b3d63/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
                format('woff'),
            url('https://use.typekit.net/af/61f808/00000000000000003b9b3d63/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
                format('opentype');
        font-display: swap;
        font-style: normal;
        font-weight: 400;
    }

    @font-face {
        font-family: 'source-sans-pro';
        src: url('https://use.typekit.net/af/422d60/00000000000000003b9b3d67/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/422d60/00000000000000003b9b3d67/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3')
                format('woff'),
            url('https://use.typekit.net/af/422d60/00000000000000003b9b3d67/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3')
                format('opentype');
        font-display: swap;
        font-style: normal;
        font-weight: 700;
    }

    @font-face {
        font-family: 'source-sans-pro';
        src: url('https://use.typekit.net/af/9373a0/00000000000000003b9b3d68/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/9373a0/00000000000000003b9b3d68/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3')
                format('woff'),
            url('https://use.typekit.net/af/9373a0/00000000000000003b9b3d68/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i7&v=3')
                format('opentype');
        font-display: swap;
        font-style: italic;
        font-weight: 700;
    }

    @font-face {
        font-family: 'source-sans-pro';
        src: url('https://use.typekit.net/af/ffb1e2/00000000000000003b9b3d64/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/ffb1e2/00000000000000003b9b3d64/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3')
                format('woff'),
            url('https://use.typekit.net/af/ffb1e2/00000000000000003b9b3d64/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3')
                format('opentype');
        font-display: swap;
        font-style: italic;
        font-weight: 400;
    }

    @font-face {
        font-family: 'source-sans-pro';
        src: url('https://use.typekit.net/af/348732/00000000000000003b9b3d65/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/348732/00000000000000003b9b3d65/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3')
                format('woff'),
            url('https://use.typekit.net/af/348732/00000000000000003b9b3d65/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3')
                format('opentype');
        font-display: swap;
        font-style: normal;
        font-weight: 600;
    }

    @font-face {
        font-family: 'rucksack';
        src: url('https://use.typekit.net/af/81f247/000000000000000000017746/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/81f247/000000000000000000017746/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3')
                format('woff'),
            url('https://use.typekit.net/af/81f247/000000000000000000017746/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n9&v=3')
                format('opentype');
        font-display: swap;
        font-style: normal;
        font-weight: 900;
    }

    @font-face {
        font-family: 'rucksack';
        src: url('https://use.typekit.net/af/9018b1/000000000000000000017742/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/9018b1/000000000000000000017742/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
                format('woff'),
            url('https://use.typekit.net/af/9018b1/000000000000000000017742/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3')
                format('opentype');
        font-display: swap;
        font-style: normal;
        font-weight: 400;
    }

    @font-face {
        font-family: 'rucksack';
        src: url('https://use.typekit.net/af/5ecad7/000000000000000000017744/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/5ecad7/000000000000000000017744/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3')
                format('woff'),
            url('https://use.typekit.net/af/5ecad7/000000000000000000017744/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n6&v=3')
                format('opentype');
        font-display: swap;
        font-style: normal;
        font-weight: 600;
    }

    @font-face {
        font-family: 'rucksack';
        src: url('https://use.typekit.net/af/f1567f/000000000000000000017743/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3')
                format('woff2'),
            url('https://use.typekit.net/af/f1567f/000000000000000000017743/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3')
                format('woff'),
            url('https://use.typekit.net/af/f1567f/000000000000000000017743/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3')
                format('opentype');
        font-display: swap;
        font-style: normal;
        font-weight: 500;
    }

    .tk-source-sans-pro {
        font-family: 'source-sans-pro', sans-serif;
    }

    .tk-rucksack {
        font-family: 'rucksack', sans-serif;
    }
`
