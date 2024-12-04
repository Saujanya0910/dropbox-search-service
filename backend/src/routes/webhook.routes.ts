import { Router } from 'express';
import { handleDropboxChanges } from '../services/dropbox';

const router = Router();

// Endpoint for webhook verification
router.get('/', (req, res) => {
  const challenge = req.query.challenge;
  if (challenge) {
    res.send(challenge);
  } else {
    res.status(400).send('No challenge found');
  }
});

// Endpoint for receiving webhook notifications
router.post('/', async (req, res) => {
  res.sendStatus(200);
  if (req.body.list_folder && req.body.list_folder.accounts) {
    await handleDropboxChanges();
  }
});

export default router;