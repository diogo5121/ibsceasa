'use client'
import ProtectedRouts from "@/components/ProtectedRoutes";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import "../app/globals.css";




export default function Home() {
    const router = useRouter()

    return (
        <ProtectedRouts>
            <Box>



            </Box>
        </ProtectedRouts>
    );
}