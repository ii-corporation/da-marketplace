import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Card, CardActionArea, CardMedia, CardContent, Typography, Grid, Box } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import binaryOptionImage from "../../images/binary-option.png";

const NewComponent = ({ history } : RouteComponentProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid container direction="column">
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/registry/instruments/new/binaryoption")}>
                      <CardMedia className={classes.media} image={binaryOptionImage} title="Binary Option" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Binary Option</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Create a binary option instrument</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            {/* <Grid item xs={4}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/custody/accounts")}>
                      <CardMedia className={classes.media} image={custodyImage} title="Custody" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Custody</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your custodial services</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/registry/instruments")}>
                      <CardMedia className={classes.media} image={registryImage} title="Registry" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Registry</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Register new instruments</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/issuance/issuances")}>
                      <CardMedia className={classes.media} image={issuanceImage} title="Issuance" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Issuance</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your asset issuance</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/distribution/auctions")}>
                      <CardMedia className={classes.media} image={distributionImage} title="Distribution" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Distribution</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your primary distributions</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/listing/listings")}>
                      <CardMedia className={classes.media} image={listingImage} title="Listing" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Listing</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your exchange listings</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container justify="center">
                <Card className={classes.root}>
                  <Box border={2} borderColor="primary.main">
                    <CardActionArea onClick={() => history.push("/apps/trading/markets")}>
                      <CardMedia className={classes.media} image={tradingImage} title="Trading" />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.cardText}>Trading</Typography>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.cardText}>Manage your trading activities</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Box>
                </Card>
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles((theme : any) => createStyles({
  root: {
    minWidth: 350,
    maxWidth: 350,
    marginTop: 200,
    backgroundColor: theme.palette.primary.main, //"#00565f",
  },
  media: {
    height: 140,
    backgroundColor: "white",
  },
  cardText: {
    color: "white",
  },
}));

export const New = withRouter(NewComponent);