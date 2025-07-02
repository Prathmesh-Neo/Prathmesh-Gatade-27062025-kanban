import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
function TaskCount() {

    const tasks = useSelector((state) => state.tasks.tasks);
    const counts = {
        backlog: tasks.backlog.length,
        todo: tasks.todo.length,
        inProgress: tasks.inProgress.length,
        done: tasks.done.length,
    };


    const countCards = [
        {
            label: "Backlog Tasks",
            count: counts.backlog,
            bgColor: "#FFFDE7",
            borderColor: "#FBC02D",
        },
        {
            label: "To Do Tasks",
            count: counts.todo,
            bgColor: "#E3F2FD",
            borderColor: "#42A5F5",
        },
        {
            label: "In Progress",
            count: counts.inProgress,
            bgColor: "#FCE4EC",
            borderColor: "#EC407A",
        },
        {
            label: "Completed",
            count: counts.done,
            bgColor: "#E8F5E9",
            borderColor: "#66BB6A",
        },
    ];

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
            {countCards.map((card, idx) => (
                <Box
                    key={idx}
                    sx={{
                        border: `1px solid ${card.borderColor}`,
                        backgroundColor: card.bgColor,
                        padding: 1,
                        borderRadius: 3,
                        minWidth: "150px",
                        width: { xs: "100%", sm: "auto" },
                        textAlign: "center",
                        boxShadow: 2,
                    }}
                >
                    <Typography variant="subtitle1" fontWeight="bold">
                        {card.label}
                    </Typography>
                    <Typography variant="h6" color="textPrimary">
                        {card.count}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

export default TaskCount;
