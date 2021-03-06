import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import {
    useWeb3React,
} from "@web3-react/core";


const useStyles = makeStyles((theme) => ({
    mobileContainer: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
        justifyContent: 'space-evenly'
    },
}));

export default function MobileWalletInfo({ dittoBalance, xDittoBalance, exchangeRate, usdPrice }) {

    const classes = useStyles();
    const context = useWeb3React();
    const {
        library,
        chainId,
        account,
        activate,
        deactivate,
        active,
        error
    } = context;
    const dittoInUSD = parseFloat(usdPrice) * parseFloat(dittoBalance);
    const xDittoInUSD = (parseFloat(usdPrice) * parseFloat(exchangeRate)) * parseFloat(xDittoBalance);


    return (
        <Box className={classes.mobileContainer}>
            <Box textAlign='center'>
                <Typography color="primary" variant="body2">GHD in wallet</Typography>
                {
                    account === undefined
                        ?
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                        :
                        account === null
                            ?
                            <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{None}</Typography>
                            :
                            <Box>
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{`${parseFloat(dittoBalance).toFixed(4)} GHD`}</Typography>
                                <br />

                            </Box>
                }
            </Box>
            <Box textAlign='center'>
                <Typography color="primary" variant="body2">WGHD in wallet</Typography>
                {
                    account === undefined
                        ?
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                        :
                        account === null
                            ?
                            <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{None}</Typography>
                            :
                            <Box>
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{`${parseFloat(xDittoBalance).toFixed(4)} WGHD`}</Typography>
                                <br />
                            </Box>


                }
            </Box>
            <Box textAlign='center'>
                <Typography color="primary" variant="body2">Exchange rate</Typography>
                {
                    account === undefined
                        ?
                        <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{'...'}</Typography>
                        :
                        account === null
                            ?
                            <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{Unavailable}</Typography>
                            :
                            <Box>
                                <Typography color="textPrimary" variant="caption" style={{ paddingTop: '10px' }}>{`1 WGHD = 1 GHD`}</Typography>
                                <br />
                            </Box>
                }
            </Box>
        </Box>
    );
};
