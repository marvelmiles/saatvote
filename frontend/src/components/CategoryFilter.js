import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Dialog from "./Dialog";
import { getCategories } from "../api/mass";
import { Box } from "@mui/system";
import {
  Button,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Popover,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { debounce } from "../helpers";
import { FilterAlt, HowToVote } from "@mui/icons-material";
import Person from "./Person";
import axios from "../api/axios";
import { ROLE, UNIT_PATH } from "../config";
import { useContext } from "../provider";

function CategoryFilter({
  open = false,
  useVoteBtn = false,
  closeOnBackdrop = false,
  personProps = {},
  keepCallbackAlive = false,
  editorMode = false,
  cookie = {},
  setDialogProps,
  setSnackMsg,
  closeDialog,
  onFormData = () => {},
  onClose = () => {},
}) {
  let stateRef = useRef({
    categories: [],
    loading: true,
    header: null,
    content: null,
    updateHeader: true,
  });
  stateRef = stateRef.current;
  const { socket } = useContext();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [nominees, setNominees] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [voterPolls, setVoterPolls] = useState({});
  const filterRef = useRef();

  useEffect(() => {
    if (socket) {
      socket.off("nominee-update").on("nominee-update", (nominee, action) => {
        console.log("nominee update............. ", action);
        let cat;
        stateRef.categories = stateRef.categories.map((c) => {
          console.log(c.name, nominee);
          if (c.name === nominee.category) {
            if (action === "delete")
              c.nominees = c.nominees.filter((n) => n.id !== nominee.id);
            else if (action === "add") c.nominees.push(nominee);
            cat = c;
          }
          return c;
        });
        if (cat) {
          setCategory((prev) => {
            return prev.name === nominee.category ? cat : prev;
          });
          setCategories(stateRef.categories);
          setNominees(cat.nominees);
        }
      });
      socket.on("voter-poll", (polls) => {
        setVoterPolls(polls);
      });
    }
  }, [socket, category.name]);

  useEffect(() => {
    const getVoterPolls = async () => {
      try {
        setVoterPolls(
          (await axios.get(`${UNIT_PATH}/voter/${cookie.voter.id}/polls`)).data
        );
      } catch (err) {
        console.log(err.response?.data || err.message, "user poll err");
        setVoterPolls({});
      }
    };
    useVoteBtn && cookie.voter && getVoterPolls();
  }, [useVoteBtn, cookie]);
  const vcPoll = voterPolls[category.name] || {};
  const handleSelect = async (data, action) => {
    if (action === "delete") {
      try {
        setDialogProps({
          open: true,
          header: <Typography>Delete {data.name}?</Typography>,
          content: <Box>Clicking ok will permanently delete {data.name}.</Box>,
          footer: (
            <>
              <Button onClick={closeDialog}>Cancel</Button>
              <Button
                onClick={async () => {
                  console.log(
                    data.category,
                    category.name,
                    data.id,
                    "deleted info"
                  );
                  const res = (
                    await axios.delete(
                      `${UNIT_PATH}/category/${data.category}/nominee/${data.id}`,
                      {
                        headers: {
                          authorization: `Bearer ${cookie.jwtToken}`,
                        },
                        role: ROLE.ELECTORATE,
                      }
                    )
                  ).data;
                  closeDialog(() => setSnackMsg(res, 5000));
                }}
              >
                ok
              </Button>
            </>
          ),
          styles: {
            paper: {
              height: "auto",
              maxWidth: "200px",
            },
          },
        });
      } catch (err) {
        setSnackMsg(err.response?.data || err.message, 5000);
      }
      return;
    } else if (action === "vote") {
      try {
        console.log("voting....");
        setSnackMsg(
          (
            await axios.put(
              `${UNIT_PATH}/voter/vote/${data.category}/${data.id}`,
              cookie.voter,
              {
                headers: {
                  authorization: `Bearer ${cookie.jwtToken}`,
                },
                role: ROLE.ELECTORATE,
              }
            )
          ).data,
          5000
        );
        return true;
      } catch (err) {
        setSnackMsg(err.response?.data || err.message, 5000);
      }
    } else if (action === "edit") return onFormData(data, "nominee", action);
  };

  if (open) {
    stateRef.content = (
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="space-between"
        sx={
          {
            // border: "2px solid blue",
          }
        }
      >
        {stateRef.loading ? (
          Array.from(new Array(14)).map((_, i) => (
            <Person
              key={i}
              {...personProps}
              styles={_styles.person}
              editorMode={editorMode}
            >
              {useVoteBtn && (
                <Skeleton
                  animation="wave"
                  variant="rectangular"
                  sx={{
                    ..._styles.btn,
                    p: 3,
                  }}
                />
              )}
            </Person>
          ))
        ) : stateRef.categories.length ? (
          <>
            {nominees.length ? (
              nominees.map((n, i) => (
                <Person
                  {...personProps}
                  title1={n.name}
                  title2="3333333333"
                  key={i}
                  styles
                  onSelect={(type) => handleSelect(n, type)}
                  editorMode={editorMode}
                  hasPreviledge={n.createdBy.id === cookie.electorate?.id}
                  owner={n.createdBy.name}
                >
                  {useVoteBtn ? (
                    <Button
                      variant="contained"
                      sx={{
                        ..._styles.btn,
                        p: 2,
                      }}
                      onClick={() => handleSelect(n, "vote")}
                    >
                      Vote me
                      <HowToVote fontSize="large" sx={{ mx: 1 }} />
                    </Button>
                  ) : null}
                </Person>
              ))
            ) : (
              <Box sx={_styles.empty}>
                <Typography variant="h2" component="h2">
                  No nominee found
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box sx={_styles.empty}>
            <Typography variant="h2" component="h2">
              No entries
            </Typography>
          </Box>
        )}
      </Stack>
    );

    stateRef.header = (
      <Box sx={{ width: "calc(100% - 40px)", pb: category.name ? 0 : 1 }}>
        {stateRef.loading ? (
          <>
            <Box>
              <Skeleton animation="wave" height="10px" />
              <Skeleton animation="wave" height="10px" width="80%" />
              <Skeleton animation="wave" height="40px" />
            </Box>
          </>
        ) : window.location.pathname === "/" &&
          !stateRef.categories.length ? null : (
          category.name && (
            <Box>
              {useVoteBtn &&
                (vcPoll.votedFor ? (
                  <Typography>You voted for: {vcPoll.votedFor.name}</Typography>
                ) : (
                  <Typography>Vote now!</Typography>
                ))}
              <Typography sx={{ maxWidth: "calc(100% - 40px)" }} variant="h4">
                Category: {category.name}
              </Typography>
              <Typography sx={{ maxWidth: "calc(100% - 40px)" }} variant="h4">
                Nominees: {category.nominees.length}
              </Typography>
              <Input
                value={searchValue}
                sx={_styles.searchBar}
                disableUnderline
                endAdornment={
                  <InputAdornment
                    onClick={() => setAnchorEl(filterRef.current)}
                  >
                    <IconButton
                      sx={{
                        mr: -1,
                      }}
                    >
                      <FilterAlt
                        ref={filterRef}
                        sx={{
                          fontSize: "24px",
                          cursor: "pointer",
                          color: "primary.main",
                        }}
                      />
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
                onKeyUp={debounce((e) => {
                  setNominees(
                    category.nominees.filter((n) =>
                      e.target.value
                        ? new RegExp(e.target.value, "gi").test(n.name)
                        : true
                    )
                  );
                }, 200)}
              />
            </Box>
          )
        )}
      </Box>
    );
  }
  return (
    <>
      <Dialog
        onMounted={() => {
          getCategories()
            .then((categories) => {
              console.log(categories, "datata");
              stateRef.loading = false;
              stateRef.categories = categories;
              setCategories(categories);
              setCategory(categories[0] || {});
              setNominees((categories[0] || {}).nominees || []);
            })
            .catch((err) => console.log(err.message));
        }}
        content={stateRef.content}
        header={stateRef.header}
        open={open}
        onClose={onClose}
        closeOnBackdrop={closeOnBackdrop}
        keepCallbackAlive={keepCallbackAlive}
        dividers={{
          top: false,
        }}
        styles={{
          title: {
            pt: 2,
            pb: 0,
          },
        }}
      />
      <Popover
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box>
          <Box
            sx={{
              p: 1,
              pb: 0,
            }}
          >
            <Input
              sx={_styles.searchBar}
              disableUnderline
              placeholder="Search categories"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              onKeyDown={debounce((e) => {
                setCategories(
                  e.target.value
                    ? stateRef.categories.filter((c) =>
                        new RegExp(e.target.value, "gi").test(c.name)
                      )
                    : stateRef.categories
                );
              }, 200)}
            />
          </Box>
          <List
            dense={false}
            sx={{
              maxHeight: "350px",
              overflow: "auto",
              m: 0,
            }}
          >
            {categories.map((c, i) => (
              <ListItem
                key={i}
                sx={{
                  // backgroundColor: (theme) => theme.palette.divider,
                  cursor: "pointer",
                  maxWidth: "350px",
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "#fff !important",
                  },
                }}
                onClick={() => {
                  setCategory(c);
                  setNominees(c.nominees);
                  setAnchorEl(null);
                }}
              >
                <ListItemText color="primary.main">{c.name}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
      </Popover>
    </>
  );
}

// <Box>
// <Box
//   sx={{
//     width: "90%",
//     position: "relative",
//     left: "50%",
//     transform: "translateX(-50%)",
//   }}
// >
//   <Typography variant="h4" component="h4" sx={{ mt: 1 }}>
//     Voting year
//   </Typography>
//   <Input sx={_styles.searchBar} disableUnderline placeholder="2020" />
// </Box>
{
  /* <List>
  {categories.map((c, i) => (
    <ListItem
      key={i}
      sx={{
        backgroundColor: "#ccc",
        color: "#fff",
        cursor: "pointer",

        "&:hover": {
          backgroundColor: "primary.main",
        },
      }}
      onClick={() => {
        setCategory(c);
        setNominees(c.nominees);
      }}
    >
      {c.name}
    </ListItem>
  ))}
</List> */
}
// </Box>

const _styles = {
  person: {
    paper: {
      width: "220px",
    },
  },
  searchBar: {
    border: "2px solid #45678d",
    borderRadius: 12,
    my: 1,
    p: 1,
    pl: 2,
    backgroundColor: "#fff",
    width: "100%",
  },
  btn: { borderRadius: 12, my: 1 },
  empty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
};

CategoryFilter.propTypes = {};

export default CategoryFilter;
