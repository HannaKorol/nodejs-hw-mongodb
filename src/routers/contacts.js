import { Router } from 'express';

import {
  getContactsController,
    getContactByIdController,
    createContactController,
    deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/students', ctrlWrapper(getContactsController));
router.get('/contacts/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts', ctrlWrapper(createContactController));

router.delete('/contacts/:contactId', ctrlWrapper(deleteContactController));

router.patch('/contact/:contactId', ctrlWrapper(patchContactController));

export default router;
