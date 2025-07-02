import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../store/slices/taskSlice";

const AddTaskDialog = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [deadline, setDeadline] = useState("");

    const [titleError, setTitleError] = useState("");
    const [descError, setDescError] = useState("");
    const [priorityError, setPriorityError] = useState("");
    const [deadlineError, setDeadlineError] = useState("");

    const validate = () => {
        let valid = true;

        if (!title.trim()) {
            setTitleError("Title is required");
            valid = false;
        } else {
            setTitleError("");
        }

        if (!description.trim()) {
            setDescError("Description is required");
            valid = false;
        } else {
            setDescError("");
        }

        if (!priority) {
            setPriorityError("Priority is required");
            valid = false;
        } else {
            setPriorityError("");
        }

        if (!deadline) {
            setDeadlineError("Deadline is required");
            valid = false;
        } else {
            setDeadlineError("");
        }

        return valid;
    };

    const handleSubmit = () => {
        if (validate()) {
            dispatch(addTask(title, description, priority, deadline));
            setTitle("");
            setDescription("");
            setPriority("");
            setDeadline("");
            setTitleError("");
            setDescError("");
            setPriorityError("");
            setDeadlineError("");
            handleClose();
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        autoFocus
                        error={!!titleError}
                        helperText={titleError}
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        error={!!descError}
                        helperText={descError}
                    />

                    <FormControl fullWidth error={!!priorityError}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            label="Priority"
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                        <FormHelperText>{priorityError}</FormHelperText>
                    </FormControl>

                    <TextField
                        label="Deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!deadlineError}
                        helperText={deadlineError}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="error">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained">
                    Add Task
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTaskDialog;
