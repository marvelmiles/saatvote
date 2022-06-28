import PropTypes from "prop-types";
import { Box } from "@mui/system";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { EmailOutlined, LocationOnOutlined, Phone } from "@mui/icons-material";
import Link from "@mui/material/Link";

import Stack from "@mui/material/Stack";
import { POLLING_UNIT } from "../config";
function Footer(props) {
  const links = [
    {
      href: "https://www.futa.edu.ng/firarsnew",
      text: "Undergraduate Portal",
    },
    {
      href: "https://transcript.futa.edu.ng/",
      text: "e-Transcript Application",
    },
    {
      href: "https://www.futa.edu.ng/futalibrary/",
      text: "Library Registration",
    },
    {
      href: "https://futa.edu.ng/home/policies",
      text: "University Policies",
    },
    {
      href: "https://learn.futa.edu.ng/",
      text: "e-Learning Portal",
    },
  ];
  const theme = useTheme();
  return (
    <>
      <Box
        component="section"
        sx={{
          // borderTopLeftRadius: "200px",
          backgroundColor: "primary.main",
          width: "100%",
          color: "primary.light",
          py: 5,
          pb: 2,
        }}
      >
        <Stack
          justifyContent="space-between"
          direction={{
            xs: "column",
            s600: "row",
          }}
        >
          <Stack
            width="100%"
            direction={{
              xs: "row",
              s600: "column",
            }}
            alignItems="center"
            justifyContent="space-around"
            sx={{
              flexShrink: 10,
            }}
          >
            <Link
              href="#"
              sx={{
                color: "primary.light",
                textDecoration: "none",
                mb: 2,
              }}
            >
              <Box sx={theme.socialsStyle}>
                <i className="fab fa-facebook-f"></i>
              </Box>
            </Link>
            <Link
              href="#"
              sx={{
                color: "primary.light",
                textDecoration: "none",
                mb: 2,
              }}
            >
              <Box sx={theme.socialsStyle}>
                <i className="fab fa-twitter"></i>
              </Box>
            </Link>
            <Link
              href="#"
              sx={{
                color: "primary.light",
                textDecoration: "none",
                mb: 2,
              }}
            >
              <Box sx={theme.socialsStyle}>
                <i className="fab fa-linkedin-in"></i>
                {/* <FontAwesomeIcon icon="fa-brands fa-linkedin-in" /> */}
              </Box>
            </Link>
          </Stack>
          <Stack
            direction={{
              xs: "column",
              s480: "row",
            }}
            justifyContent="space-around"
            sx={{
              width: "100%",
            }}
          >
            <List
              subheader={
                <Typography variant="h3" component="li">
                  Featured Links
                </Typography>
              }
              sx={_styles.list}
            >
              {links.map((l, i) => (
                <ListItem key={i} disableGutters>
                  <Link
                    href={l.href}
                    sx={{
                      color: "#fff",
                      fontSize: "16px",
                      ..._styles.listText,
                    }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {l.text}
                  </Link>
                </ListItem>
              ))}
            </List>

            <List
              subheader={
                <Typography variant="h3" component="li">
                  Contacts
                </Typography>
              }
              sx={_styles.list}
            >
              <ListItem disableGutters sx={_styles.listItem}>
                <ListItemIcon sx={_styles.listIcon}>
                  <EmailOutlined sx={_styles.icon} />
                </ListItemIcon>
                <ListItemText
                  sx={_styles.listText}
                  disableTypography
                  primary="marvellousabidemi2@gmail.com"
                />
              </ListItem>
              <ListItem disableGutters sx={_styles.listItem}>
                <ListItemIcon sx={_styles.listIcon}>
                  <Phone sx={_styles.icon} />
                </ListItemIcon>
                <ListItemText
                  sx={_styles.listText}
                  disableTypography
                  primary="09162670753, 07019667900"
                />
              </ListItem>
              <ListItem disableGutters sx={_styles.listItem}>
                <ListItemIcon sx={_styles.listIcon}>
                  <LocationOnOutlined sx={_styles.icon} />
                </ListItemIcon>
                <ListItemText
                  sx={_styles.listText}
                  disableTypography
                  primary="The Federal University of Technology Akure P.M.B. 704 Akure,
            Ondo state."
                  secondary=" Faculty of Agriculture (SAAT)"
                />
              </ListItem>
            </List>
          </Stack>
        </Stack>
        <Typography align="center" variant="h4">
          @saat-vote {new Date().getFullYear()}.
        </Typography>
      </Box>
    </>
  );
}

Footer.propTypes = {};

const _styles = {
  list: {
    p: 1,
  },
  listText: {
    wordBreak: "break-word",
    letterSpacing: 1,
    color: "#fff",
  },
  icon: {
    fontSize: "32px",
    color: "#fff",
  },
  listItem: {
    fontSize: "16px",
    maxWidth: "350px",
  },
  listIcon: {
    minWidth: "auto",
    mx: 1,
  },
};

export default Footer;
