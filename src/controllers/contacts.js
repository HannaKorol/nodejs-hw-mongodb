import createHttpError from 'http-errors';

import { deleteContact } from '../services/contacts.js';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { createContact } from '../services/contacts.js';
import { updateContact } from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';


export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  /*  try { */
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id, // !Отримуємо userId з контролера
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
  /*  } catch (err) {
    next(err);
  } */
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params; // Extract contactId from params
  const { _id: userId } = req.user; // Извлекаем userId из req.user

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
    /*  next(new Error('Contact not found'));
    return; */
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};


export const createContactController = async (req, res) => {
  
    const contact = await createContact({ ...req.body, userId: req.user._id });//! userId

   if (!contact) {
     return res
       .status(400)
       .json({ status: 400, message: 'Error creating contact' });
   }
  
  res.status(201).json({
    status: 201,
    message: 'Successfully  created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId); 

  if (!contact) {
    throw createHttpError(404, 'Contact  not found');
  }

  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;

  let photoUrl;
  
   if (photo) {
if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
  photoUrl = await saveFileToCloudinary(photo);
} else {
  photoUrl = await saveFileToUploadDir(photo);
}}

  /* в photo лежить обʼєкт файлу
		{
		  fieldname: 'photo',
		  originalname: 'download.jpeg',
		  encoding: '7bit',
		  mimetype: 'image/jpeg',
		  destination: '/Users/borysmeshkov/Projects/goit-study/students-app/temp',
		  filename: '1710709919677_download.jpeg',
		  path: '/Users/borysmeshkov/Projects/goit-study/students-app/temp/1710709919677_download.jpeg',
		  size: 7
	  }
	*/

  const result = await updateContact(contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};







