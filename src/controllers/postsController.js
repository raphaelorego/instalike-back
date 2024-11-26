import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
    // Define uma rota GET para a URL '/posts/'.
    // Quando uma requisição GET for feita para essa URL, esta função será executada.
        const posts = await getTodosPosts();
        // Chama a função getTodosPosts para obter todos os posts e armazena o resultado em 'posts'.
        res.status(200).json(posts);
        // Envia uma resposta HTTP com status 200 (OK) e os dados dos posts em formato JSON.
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch(erroNovoPost) {
        console.error(erroNovoPost.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

export async function uploadImagem(req, res) {
        const novoPost = {
            descricao: "",
            imgUrl: req.file.originalname,
            alt: ""
        }
    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.jpg`;
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);
    } catch(erroNovoPost) {
        console.error(erroNovoPost.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.jpg`;
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.jpg`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch(erroNovoPost) {
        console.error(erroNovoPost.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    }
}