

import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTelegram, faTwitter, faGithub, faMedium , falinkedin} from '@fortawesome/free-brands-svg-icons'

import Image from 'next/image'

import {
    useWeb3React,
} from "@web3-react/core";


const useStyles = makeStyles((theme) => ({
    desktopContainer: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'block',
        }
    },
    mobileContainer: {
        display: 'block',
        flexDirection: 'column',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
        paddingTop: "2%"
    }
}));

export default function Footer() {

    const classes = useStyles();
    const context = useWeb3React();
    const {
        connector,
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error
    } = context;

    return (
        <>
            <Box className={classes.desktopContainer} position='sticky' top="85%">
                <Box display="flex" justifyContent="space-between">
                    <Box display="flex" alignItems="center" paddingLeft={'5%'}>
                        <Image
                            src="/images/ditto.png"
                            alt="Main Ditto logo mascot"
                            width={'100%'}
                            height={'100%'}
                        />
                    </Box>
                    <Box display="flex" alignItems="center" paddingLeft={5} width="45%" justifyContent="space-evenly">
                        <a href="https://t.me/GiftedHandsTokenChannel" target="_blank"><FontAwesomeIcon icon={faTelegram} size="2x" style={{ color: '#61be6c' }} /></a>
                        <a href="https://twitter.com/giftedhandsGHD_" target="_blank"><FontAwesomeIcon icon={faTwitter} size="2x" style={{ color: '#61be6c' }} /></a>
                    </Box>
                    <Box display="flex" alignItems="center" paddingRight={'5%'}>
                        <Typography color="textPrimary">GiftedHands Token Wrapper</Typography>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.mobileContainer}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Box display="flex" alignItems="center">
                        <Image
                            src="/images/ditto.png"
                            alt="Main Ditto logo mascot"
                            width={'100%'}
                            height={'100%'}
                        />
                    </Box>
                    <Box display="flex" alignItems="center" width="100%" justifyContent="space-evenly" marginY="5%">
                        <a href="https://t.me/GiftedHandsTokenChannel" target="_blank"><FontAwesomeIcon icon={faTelegram} size="2x" style={{ color: '#61be6c' }} /></a>
                        <a href="https://twitter.com/giftedhandsGHD_" target="_blank"><FontAwesomeIcon icon={faTwitter} size="2x" style={{ color: '#61be6c' }} /></a>
                    </Box>
                    <Box display="flex" alignItems="center" textAlign="center">
                        <Typography color="textPrimary">GiftedHands Token Wrapper</Typography>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
