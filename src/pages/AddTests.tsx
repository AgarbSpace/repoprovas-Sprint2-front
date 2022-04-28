import {
    Box,
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../components/Form";
import useAlert from "../hooks/useAlert";
import useAuth from "../hooks/useAuth";
import api, {
    Category,
    TestByDiscipline,
} from "../services/api";
import { AxiosError } from "axios";


interface FormData {
    testTitle: string;
    pdfTest: string;
    category: string;
    discipline: string;
    teacher: string;
}

const styles = {
    input : { marginBottom: "16px",
        width: "700px"},
        actionsContainer: {
        display: "flex",
        justifyContent: "space-between",
    }
}

function AddTest() {
    const { token } = useAuth();
    const [terms, setTerms] = useState<TestByDiscipline[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const { setMessage } = useAlert();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        testTitle: "",
        pdfTest: "",
        category: "",
        discipline: "",
        teacher: ""
    });

useEffect(() => {
    async function loadPage() {
        if (!token) return;
        const { data: testsData } = await api.getTestsByDiscipline(token);
        setTerms(testsData.tests);
        const { data: categoriesData } = await api.getCategories(token);
        setCategories(categoriesData.categories);
    }
    loadPage();
}, [token]);

function handleInputChange(e: any) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
}

async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!formData?.testTitle || !formData?.pdfTest || !formData?.category || !formData?.discipline || !formData?.teacher) {
        setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
        return;
    }

    try {
        console.log(formData)
        await api.addTest({ ...formData });
        navigate("/app/disciplinas");
    } catch (error: Error | AxiosError | any) {
    if (error.response) {
        setMessage({
            type: "error",
            text: error.response.data,
        });
        return;
    }

    setMessage({
        type: "error",
        text: "Erro, tente novamente em alguns segundos!",
        });
    }
}

return (
    <>
        <Typography  component="span"
            sx={{justify: "center",
            marginX: "auto",
            marginBottom: "25px",
            fontFamily: "Roboto",
            fontWeight: 500}
        }>
            Adicione uma prova
        </Typography>
        <Divider sx={{ marginBottom: "35px" }} />
        <Box
            sx={{
                marginX: "auto",
                width: "700px",
            }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <Button
                    variant="outlined"
                    onClick={() => navigate("/app/disciplinas")}>
                        Disciplinas
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/app/pessoas-instrutoras")}>
                        Pessoa Instrutora
                </Button>
                <Button 
                    variant="contained" 
                    onClick={() => navigate("/app/adicionar")}>
                        Adicionar
                </Button>
            </Box>
        <Form onSubmit={handleSubmit}>
            <TextField
                name="testTitle"
                sx={styles.input}
                label="Título da prova"
                type="text"
                variant="outlined"
                onChange={handleInputChange}
                value={formData.testTitle}
            />
            <TextField
                name="pdfTest"
                sx={styles.input}
                label="PDF da prova"
                type="text"
                variant="outlined"
                onChange={handleInputChange}
                value={formData.pdfTest}
            />
            <FormControl>
                <InputLabel>Categoria</InputLabel>
                <Select
                    name="category"
                    sx={styles.input}
                    type="text"
                    variant="outlined"
                    onChange={handleInputChange}
                    value={formData.category}>
                        {categories.map((category) => <MenuItem 
                            key = {category.id} 
                            value = {category.name}>
                                {category.name}
                        </MenuItem>)}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Disciplina</InputLabel>
                <Select
                    name="discipline"
                    sx={styles.input}
                    label="Disciplina"
                    type="text"
                    variant="outlined"
                    value={formData.discipline}
                    onChange={handleInputChange}>
                        {terms.map(term => term.disciplines.map(discipline => 
                        <MenuItem key = {discipline.id} 
                            value = {discipline.name}>
                                {discipline.name}
                        </MenuItem>))}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Pessoa Instrutora</InputLabel>
                <Select
                    name="teacher"
                    sx={styles.input}
                    label="Pessoa instrutora"
                    type="text"
                    variant="outlined"
                    value={formData.teacher}
                    onChange={handleInputChange}>
                        {terms.map(term => term.disciplines.map(discipline => 
                            discipline.teacherDisciplines.map(teachers => 
                            <MenuItem key = {teachers.teacher.id} 
                            value = {teachers.teacher.name}>
                                {teachers.teacher.name}
                            </MenuItem>)))}
                    </Select>
                </FormControl>
                <Button
                    sx={{width: "700px"}}
                    variant="contained"
                    type="submit">
                        Enviar
                </Button>
            </Form>
        </Box>
    </>
)};


export default AddTest;
