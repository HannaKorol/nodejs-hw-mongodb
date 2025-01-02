import { Router } from 'express';

import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { modifyContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getContactsController));
router.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/register',    //!почиму регистер в этом случае а не контактс или просто палка?????????????????????????????????
  validateBody(updateContactSchema),
  ctrlWrapper(createContactController),
);

router.delete('/:contactId', ctrlWrapper(deleteContactController));

router.patch(
  '/:contactId',
  validateBody(modifyContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
