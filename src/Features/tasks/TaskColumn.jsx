import { Box, Typography, IconButton } from "@mui/material";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useDispatch } from "react-redux";
import { moveTaskByArrow, deleteTask } from "../../store/slices/taskSlice";
import React from "react";

const getPriorityColor = (priority) => {
    switch (priority) {
        case "High": return "#FFCDD2";
        case "Medium": return "#FFF9C4";
        case "Low": return "#C8E6C9";
        default: return "white";
    }
};

const getBadgeColor = (priority) => {
    switch (priority) {
        case "High": return "#e53935";
        case "Medium": return "#fdd835";
        case "Low": return "#43a047";
        default: return "#90A4AE";
    }
};

function TaskColumn({ columnKey, title, tasks, onEdit }) {
    const dispatch = useDispatch();

    return (
        <Droppable droppableId={columnKey}>
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
                        backgroundColor: snapshot.isDraggingOver ? "#E3F2FD" : "#F8FAFC",
                    }}
                >
                    <Typography variant="h6" sx={{ padding: 1 }}>{title}</Typography>

                    {tasks.map((task, index) => (
                        <Draggable draggableId={task.id} index={index} key={task.id}>
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
                                    }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Box>
                                            <Typography fontWeight="bold">{task.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">{task.description}</Typography>
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
                                            <IconButton onClick={() => onEdit(task, columnKey, index)} size="small">
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => dispatch(deleteTask({ stage: columnKey, index }))}
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
    );
}

export default React.memo(TaskColumn);
