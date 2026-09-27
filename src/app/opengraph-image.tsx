import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { COMPANY } from '@/lib/company';
import {
    SHARE_IMAGE_ALT,
    SHARE_IMAGE_COLOURS,
    SHARE_IMAGE_CONTENT_TYPE,
    SHARE_IMAGE_FONTS,
    SHARE_IMAGE_SIZE,
} from '@/lib/seo/shareImage';

export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = SHARE_IMAGE_CONTENT_TYPE;

const [regular, semiBold, logo] = await Promise.all([
    readFile(SHARE_IMAGE_FONTS.regular),
    readFile(SHARE_IMAGE_FONTS.semiBold),
    // The inverted logo, since the card's ground is the dark hero band. See scripts/prepare-logo.mjs.
    readFile(join(process.cwd(), 'public', 'logo-white.png')),
]);

const LOGO = `data:image/png;base64,${logo.toString('base64')}`;

/**
 * The preview a link to the front page renders as: mark, name, tagline. The address and the
 * description are left to the meta tags, which every platform prints as text beside the card.
 * Centred, because a feed that crops the card to a square takes the middle.
 */
export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: SHARE_IMAGE_COLOURS.background,
                    color: SHARE_IMAGE_COLOURS.heading,
                    fontFamily: 'Geist',
                }}
            >
                {/* The header lockup, at the proportions Nav.tsx sets it in. */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                    <img src={LOGO} width={34} height={68} />
                    <div
                        style={{
                            display: 'flex',
                            marginLeft: 22,
                            fontSize: 50,
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {COMPANY.name}
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        marginTop: 44,
                        fontSize: 40,
                        color: SHARE_IMAGE_COLOURS.body,
                    }}
                >
                    {COMPANY.tagline}
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: 'Geist', data: regular, weight: 400, style: 'normal' },
                { name: 'Geist', data: semiBold, weight: 600, style: 'normal' },
            ],
        },
    );
}
