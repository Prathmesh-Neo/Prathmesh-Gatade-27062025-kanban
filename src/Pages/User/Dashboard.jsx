import {
    Box,
    Typography,
    Button,
    CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import TaskCount from "../../Components/TaskCount";
import { useState, Suspense, lazy } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { moveTask, editTask } from "../../store/slices/taskSlice";
import TaskColumn from "../../Features/tasks/TaskColumn";

const AddTaskDialog = lazy(() => import("../../Components/AddTask"));
const EditTaskDialog = lazy(() => import("../../Components/EditeTAsk"));

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

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination || (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )) return;

        dispatch(
            moveTask({
                sourceStage: source.droppableId,
                destStage: destination.droppableId,
                sourceIndex: source.index,
                destIndex: destination.index,
            })
        );
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
                    <Suspense fallback={<CircularProgress />}>
                        <AddTaskDialog open={dialogOpen} handleClose={handleClose} />
                        {editOpen && (
                            <EditTaskDialog
                                open={editOpen}
                                onClose={() => setEditOpen(false)}
                                onSave={handleEditSave}
                                initialData={editData}
                            />
                        )}
                    </Suspense>
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
                        <TaskColumn
                            key={columnKey}
                            columnKey={columnKey}
                            title={COLUMN_TITLES[columnKey]}
                            tasks={tasks[columnKey]}
                            onEdit={handleEdit}
                        />
                    ))}
                </Box>
            </DragDropContext>
        </Box>
    );
}

export default Dashboard;

