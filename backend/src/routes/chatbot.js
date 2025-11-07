import { Router } from 'express';
import { getChatResponse } from '../controllers/chatbotController.js';

const router = Router();

// Chatbot endpoint
router.post('/', getChatResponse);

export default router;
