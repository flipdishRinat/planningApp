import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Fab,
  Fade,
  Grid,
  makeStyles,
  Modal,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "axios";

export const ColumnOfCards = ({ CardsToChild, cardsStatus, CardsToParent }) => {
  var nowDate = new Date().toISOString().slice(0, 10);
  const [text, setText] = useState("");
  const [Cards, setCards] = useState([...CardsToChild]);
  const [date, setDate] = useState(nowDate);
  const [idEdit, setIdEdit] = useState(0);
  const [statusEdit, setStatusEdit] = useState("");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  type singleCard = {
    id: number;
    description: string;
    status: string;
    dueDate: string;
  };
  var SingleCard: singleCard;

  const handleOpenEdit = (id) => {
    for (const x of Cards) {
      if (x.id === id) {
        setText(x.description);
        setDate(x.dueDate.slice(0, 10));
        setIdEdit(x.id);
        setStatusEdit(x.status);
        break;
      }
    }
    setOpenEdit(true);
  };

  const handleClose = () => {
    setText("");
    setOpen(false);
  };

  const handleCloseOkEdit = () => {
    for (const x in Cards) {
      if (Cards[x].id === idEdit) {
        Cards[x].description = text;
        Cards[x].dueDate = date;
        break;
      }
    }
    SingleCard = {
      id: idEdit,
      description: text,
      status: statusEdit,
      dueDate: date,
    };

    if (text) {
      setCards([...Cards]);
      CardsToParent([...Cards]);
      updateTodo(SingleCard);
    }
    setText("");
    setDate("");
    setOpenEdit(false);
  };

  const handleCloseEdit = () => {
    setText("");
    setOpenEdit(false);
  };

  const updateStatusNew = (id) => {
    for (const x in Cards) {
      if (Cards[x].id === id) {
        if (Cards[x].status === "todo") {
          Cards[x].status = "inProgress";
          updateTodo(Cards[x]);
          break;
        }
      }
    }
    setCards([...Cards]);
    CardsToParent([...Cards]);
  };
  const updateStatusPro = (id) => {
    for (const x in Cards) {
      if (Cards[x].id === id) {
        if (Cards[x].status === "inProgress") {
          Cards[x].status = "completed";
          updateTodo(Cards[x]);
          break;
        }
      }
    }
    setCards([...Cards]);
    CardsToParent([...Cards]);
  };
  const reverseStatusPro = (id) => {
    for (const x in Cards) {
      if (Cards[x].id === id) {
        if (Cards[x].status === "inProgress") {
          Cards[x].status = "todo";
          updateTodo(Cards[x]);
          break;
        }
      }
    }
    setCards([...Cards]);
    CardsToParent([...Cards]);
  };

  const reverseStatusFin = (id) => {
    for (const x in Cards) {
      if (Cards[x].id === id) {
        if (Cards[x].status === "completed") {
          Cards[x].status = "inProgress";
          updateTodo(Cards[x]);
          break;
        }
      }
    }
    setCards([...Cards]);
    CardsToParent([...Cards]);
  };

  const todosApi = axios.create({
    baseURL: "http://52.213.105.232:3500/main/",
  });

  async function updateTodo(todo) {
    try {
      await todosApi.post("/updateTodo", todo);
    } catch (e) {
      console.log(e);
    }
  }

  async function removeTodo(id) {
    try {
      await todosApi.post("/removeTodo", { id });
    } catch (e) {
      console.log(e);
    }
  }

  async function getTodoList() {
    try {
      const response = await todosApi.get("/getTodos");
      response.data.todos.sort(
        (a: { id: number }, b: { id: number }) => a.id - b.id //Sort by date
      );
      setCards(response.data.todos);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getTodoList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    console.log("Use effect Child");
  }, []);

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };
  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
      root: {
        "& > *": {
          margin: theme.spacing(0, 1, 2, 1),
          width: "25ch",
        },
      },
      container: {
        display: "flex",
        flexWrap: "wrap",
      },
      textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
      },
    })
  );

  const classes = useStyles();

  return (
    <Grid item xs={4}>
      <Paper elevation={2}>
        <Box p={1} bgcolor={"warning.main"}>
          <Typography variant="h5">New</Typography>
        </Box>
        {/* //Card------------------------ */}
        {Cards.filter((item) => item.status == cardsStatus).map((item) => {
          return (
            <Box
              p={1}
              key={item.id}
              bgcolor={
                item.status === "inProgress"
                  ? "success.main"
                  : item.status === "completed"
                  ? "info.main"
                  : "warning.main"
              }
            >
              <Card
                style={{
                  backgroundColor:
                    Date.now() > Date.parse(item.dueDate)
                      ? "PapayaWhip"
                      : "white",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{item.description}</Typography>
                  <Typography color="textSecondary">
                    {item.dueDate.slice(0, 10)}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* //Buttons for Card---------------------- */}
                  <div>
                    <Grid container justify="center" spacing={2}>
                      <Box p={1}>
                        <Fab
                          aria-label="input"
                          size="small"
                          onClick={() =>
                            cardsStatus === "inProgress"
                              ? reverseStatusPro(item.id)
                              : cardsStatus === "completed"
                              ? reverseStatusFin(item.id)
                              : true
                          }
                        >
                          <ArrowBackIcon />
                        </Fab>
                      </Box>
                      <Box p={1}>
                        {/* //Modal Edit---------------------- */}
                        <div>
                          <Fab
                            size="small"
                            color={"primary"}
                            aria-label="edit"
                            onClick={() => {
                              handleOpenEdit(item.id);
                            }}
                          >
                            <EditIcon />
                          </Fab>
                          <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={openEdit}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                              timeout: 500,
                            }}
                          >
                            <Fade in={openEdit}>
                              {/* Card in Modal----------------------- */}
                              <Card>
                                <CardContent>
                                  <form
                                    className={classes.root}
                                    noValidate
                                    autoComplete="off"
                                  >
                                    <TextField
                                      id="standard-basic"
                                      label="Description"
                                      multiline
                                      value={text}
                                      onChange={handleChangeText}
                                      autoFocus
                                    />
                                  </form>
                                  <form
                                    className={classes.container}
                                    noValidate
                                  >
                                    <TextField
                                      onChange={handleChangeDate}
                                      id="date"
                                      label="Select Date and Time"
                                      type="date"
                                      defaultValue={date}
                                      className={classes.textField}
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />
                                  </form>
                                </CardContent>
                                <CardActions>
                                  <ButtonGroup
                                    variant="text"
                                    color="primary"
                                    aria-label="text primary button group"
                                  >
                                    <Button onClick={handleCloseOkEdit}>
                                      OK
                                    </Button>
                                    <Button onClick={handleCloseEdit}>
                                      Cancel
                                    </Button>
                                  </ButtonGroup>
                                </CardActions>
                              </Card>
                              {/* Card in Modal----------------------- */}
                            </Fade>
                          </Modal>
                        </div>
                        {/* //Modal Edit---------------------- */}
                      </Box>
                      <Box p={1}>
                        <Fab
                          color="secondary"
                          aria-label="delete"
                          size="small"
                          onClick={() => {
                            setCards(
                              Cards.filter((myitem) => myitem.id !== item.id)
                            );
                            removeTodo(item.id);
                          }}
                        >
                          <DeleteIcon />
                        </Fab>
                      </Box>
                      <Box p={1}>
                        <Fab
                          aria-label="input"
                          size="small"
                          onClick={() =>
                            cardsStatus === "todo"
                              ? updateStatusNew(item.id)
                              : cardsStatus === "inProgress"
                              ? updateStatusPro(item.id)
                              : true
                          }
                        >
                          <ArrowForwardIcon />
                        </Fab>
                      </Box>
                    </Grid>
                  </div>
                  {/* //Buttons for Card---------------------- */}
                </CardActions>
              </Card>
            </Box>
          );
        })}
        {/* //Card------------------------ */}
      </Paper>
    </Grid>
  );
};