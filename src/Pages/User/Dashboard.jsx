import { Box, Typography, Button, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import AddTaskDialog from "../../Components/AddTask";
import EditTaskDialog from "../../Components/EditeTAsk";
import TaskCount from "../../Components/TaskCount";
import { useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";
import {
    moveTask,
    deleteTask,
    editTask,
    moveTaskByArrow,
} from "../../store/slices/taskSlice";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const COLUMN_ORDER = ["backlog", "todo", "inProgress", "done"];
const COLUMN_TITLES = {
    backlog: "Backlog",
    todo: "To Do",
    inProgress: "In Progress",
    done: "Completed",
};

function Dashboard() {
    const tasks = useSelector((state) => state.tasks.tasks);
    const dispatch = useDispatch();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const handleOpen = () => setDialogOpen(true);
    const handleClose = () => setDialogOpen(false);

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        dispatch(
            moveTask({
                sourceStage: source.droppableId,
                destStage: destination.droppableId,
                sourceIndex: source.index,
                destIndex: destination.index,
            })
        );
    };

    const handleEdit = (task, stage, index) => {
        setEditData({ ...task, stage, index });
        setEditOpen(true);
    };

    const handleEditSave = (updatedTask) => {
        dispatch(
            editTask({
                stage: editData.stage,
                index: editData.index,
                updatedTask,
            })
        );
        setEditOpen(false);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "#FFCDD2";
            case "Medium":
                return "#FFF9C4";
            case "Low":
                return "#C8E6C9";
            default:
                return "white";
        }
    };

    const getBadgeColor = (priority) => {
        switch (priority) {
            case "High":
                return "#e53935";
            case "Medium":
                return "#fdd835";
            case "Low":
                return "#43a047";
            default:
                return "#90A4AE";
        }
    };

    return (
        <Box>
            <Box sx={{
                display: { xs: 'block', lg: 'flex' }, justifyContent: 'space-between', alignItems: 'center', margin: 2
            }}>
                <TaskCount />
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Button variant="contained" onClick={handleOpen} sx={{ m: 2 }}>
                        + Add Task
                    </Button>
                    <AddTaskDialog open={dialogOpen} handleClose={handleClose} />
                    {editOpen && (
                        <EditTaskDialog
                            open={editOpen}
                            onClose={() => setEditOpen(false)}
                            onSave={handleEditSave}
                            initialData={editData}
                        />
                    )}
                </Box>
            </Box>


            <DragDropContext onDragEnd={handleDragEnd}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        justifyContent: "space-between",
                        padding: 2,
                        gap: 2,
                    }}
                >
                    {COLUMN_ORDER.map((columnKey) => (
                        <Droppable droppableId={columnKey} key={columnKey}>
                            {(provided, snapshot) => (
                                <Box
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    sx={{
                                        border: "1px solid #e0e0e0",
                                        flexBasis: { xs: "100%", md: "25%" },
                                        p: 1,
                                        minHeight: "60vh",
                                        borderRadius: 3,
                                        backgroundColor: snapshot.isDraggingOver
                                            ? "#E3F2FD"
                                            : "#F8FAFC",
                                    }}
                                >
                                    <Typography variant="h6" sx={{ padding: 1 }}>
                                        {COLUMN_TITLES[columnKey]}
                                    </Typography>

                                    {tasks[columnKey].map((task, index) => (
                                        <Draggable
                                            draggableId={task.id}
                                            index={index}
                                            key={task.id}
                                        >
                                            {(provided, snapshot) => (
                                                <Box
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    sx={{
                                                        border: "1px solid #e0e0e0",
                                                        padding: 2,
                                                        borderRadius: 3,
                                                        margin: 1,
                                                        backgroundColor: snapshot.isDragging
                                                            ? "#FFE082"
                                                            : getPriorityColor(task.priority),
                                                        boxShadow: snapshot.isDragging ? 3 : 1,
                                                        transition: "background-color 0.3s ease",
                                                    }}
                                                >
                                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                        <Box>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {task.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {task.description}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    backgroundColor: getBadgeColor(task.priority),
                                                                    color: "white",
                                                                    borderRadius: 1,
                                                                    px: 1,
                                                                    py: 0.5,
                                                                    display: "inline-block",
                                                                    fontWeight: "bold",
                                                                    fontSize: "0.75rem",
                                                                    mt: 1,
                                                                }}
                                                            >
                                                                {task.priority}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                                <strong>Deadline:</strong> {task.deadline}
                                                            </Typography>

                                                            {/* Arrows */}
                                                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                                                {columnKey !== "backlog" && (
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            dispatch(
                                                                                moveTaskByArrow({
                                                                                    stage: columnKey,
                                                                                    index,
                                                                                    direction: "backward",
                                                                                })
                                                                            )
                                                                        }
                                                                        size="small"
                                                                    >
                                                                        <ArrowBackIcon fontSize="small" />
                                                                    </IconButton>
                                                                )}
                                                                {columnKey !== "done" && (
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            dispatch(
                                                                                moveTaskByArrow({
                                                                                    stage: columnKey,
                                                                                    index,
                                                                                    direction: "forward",
                                                                                })
                                                                            )
                                                                        }
                                                                        size="small"
                                                                    >
                                                                        <ArrowForwardIcon fontSize="small" />
                                                                    </IconButton>
                                                                )}
                                                            </Box>
                                                        </Box>

                                                        <Box>
                                                            <IconButton
                                                                onClick={() => handleEdit(task, columnKey, index)}
                                                                size="small"
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={() =>
                                                                    dispatch(deleteTask({ stage: columnKey, index }))
                                                                }
                                                                color="error"
                                                                size="small"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </Box>
                            )}
                        </Droppable>
                    ))}
                </Box>
            </DragDropContext>
        </Box>
    );
}

export default Dashboard;


