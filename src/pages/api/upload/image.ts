import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Desabilita o body parser padrão do Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * API para upload de imagens para o Cloudinary
 * POST /api/upload/image
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Método não permitido'
    });
  }

  try {
    // Verifica se as variáveis de ambiente estão configuradas
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Configuração do Cloudinary não encontrada'
      });
    }

    // Configura o formidable para processar o upload
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filter: ({ mimetype }) => {
        return Boolean(mimetype && mimetype.includes('image'));
      },
    });

    // Processa o formulário
    const [fields, files] = await form.parse(req);
    
    const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images].filter(Boolean);
    
    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma imagem foi enviada'
      });
    }

    const uploadedUrls: string[] = [];

    // Faz upload de cada imagem
    for (const file of uploadedFiles) {
      if (!file) continue;

      try {
        // Lê o arquivo
        const fileBuffer = fs.readFileSync(file.filepath);
        
        // Converte para base64
        const base64String = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
        
        // Faz upload para o Cloudinary
        const result = await cloudinary.uploader.upload(base64String, {
          folder: 'portfolio-messages', // Pasta no Cloudinary
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        });

        uploadedUrls.push(result.secure_url);

        // Remove o arquivo temporário
        fs.unlinkSync(file.filepath);
      } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        // Remove o arquivo temporário em caso de erro
        if (file.filepath) {
          fs.unlinkSync(file.filepath);
        }
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao fazer upload das imagens'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Imagens enviadas com sucesso',
      urls: uploadedUrls
    });

  } catch (error) {
    console.error('Erro no upload de imagens:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
