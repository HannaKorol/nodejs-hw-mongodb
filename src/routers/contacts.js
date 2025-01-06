import { Router } from 'express';
import { upload } from '../middlewares/multer.js';


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
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();


router.use(authenticate);
router.get('/', ctrlWrapper(getContactsController));

router.get(
  '/:contactId',
  isValidId,
  upload.single('photo'), // додаємо цю middleware
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/',
  /* isValidId, */
  upload.single('photo'), // додаємо цю middleware
  validateBody(updateContactSchema),
  ctrlWrapper(createContactController),
);

router.delete('/:contactId', ctrlWrapper(deleteContactController));

router.patch(
  '/:contactId',
/*   isValidId,
 */  upload.single('photo'), // додаємо цю middleware
  validateBody(modifyContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
