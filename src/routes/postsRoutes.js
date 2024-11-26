import express from "express";
// Importa o framework Express.js para criar a aplicação web.

import multer from "multer";
// Importa o módulo Multer para lidar com o upload de arquivos (imagens).

import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";
// Importa as funções para listar posts, criar novos posts e fazer o upload de imagens, definidas no arquivo postsController.js.

import cors from "cors";

const corsOptions = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
  // Configura o armazenamento de arquivos utilizando o Multer.
  destination: function (req, file, cb) {
    // Define o diretório de destino para os arquivos enviados.
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Define o nome do arquivo no destino.
    cb(null, file.originalname);
  }
})

const upload = multer({ dest: "./uploads" , storage})
// Cria uma instância do Multer com as configurações de armazenamento definidas.
// A opção 'dest' indica o diretório de destino para os arquivos. 
// Para sistemas Linux ou macOS, a opção 'storage' pode ser omitida.

const routes = (app) => {
  // Define uma função para configurar as rotas da aplicação.
  app.use(express.json());
  // Habilita o middleware para analisar corpos de requisições em formato JSON.
  // Isso é necessário para lidar com dados enviados em formato JSON para a API.

  app.use(cors(corsOptions));

  app.get("/posts", listarPosts);
  // Define uma rota GET para a URL '/posts'.
  // Ao receber uma requisição GET para essa rota, a função 'listarPosts' será chamada.

  app.post("/posts", postarNovoPost);
  // Define uma rota POST para a URL '/posts'.
  // Ao receber uma requisição POST para essa rota, a função 'postarNovoPost' será chamada.

  app.post("/upload", upload.single("imagem"), uploadImagem);
  // Define uma rota POST para a URL '/upload'.
  // Ao receber uma requisição POST para essa rota, o middleware 'upload.single("imagem")' será usado para processar o arquivo enviado com o nome 'imagem'.
  // Em seguida, a função 'uploadImagem' será chamada para lidar com o arquivo.
  
  app.put("/upload/:id", atualizarNovoPost)
}

export default routes;
// Exporta a função 'routes' para que possa ser utilizada em outros módulos.