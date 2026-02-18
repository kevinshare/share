import { Box, Button, Typography } from "@mui/material";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import StarBackground from "../components/StarBackground";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <StarBackground />
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          gap: 3,
        }}
      >
        <Typography
          sx={{
            color: "#EDE7F6",
            fontFamily: "Tiny5, sans-serif",
            fontSize: { xs: 20, sm: 28 },
            textAlign: "center",
            px: 2,
          }}
        >
          You lost? Page doesn't exist fam
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            fontFamily: "Tiny5, sans-serif",
            fontSize: 16,
            bgcolor: "rgba(255,255,255,0.07)",
            color: "#ffffff",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
            boxShadow: "none",
            px: 3,
            py: 1,
          }}
        >
          Take me home
        </Button>
      </Box>
    </Box>
  );
}
