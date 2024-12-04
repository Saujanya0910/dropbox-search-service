import { Request, Response } from 'express';
import { handleDropboxChanges } from '../services/dropbox';

export class WebhookController {
  /**
   * Handler for webhook verification endpoint
   * @param req 
   * @param res 
   */
  static verifyWebhook(req: Request, res: Response): void {
    const challenge = req.query.challenge;
    if (challenge) {
      res.send(challenge);
    } else {
      res.status(400).send('No challenge found');
    }
  }

  /**
   * Handler for receiving webhook notifications from Dropbox
   * @param req 
   * @param res 
   */
  static async handleWebhookNotification(req: Request, res: Response): Promise<void> {
    res.sendStatus(200);
    if (req.body.list_folder && req.body.list_folder.accounts) {
      handleDropboxChanges();
    }
  }
}