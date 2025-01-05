import createHttpError from 'http-errors';

import { deleteContact } from '../services/contacts.js';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { createContact } from '../services/contacts.js';
import { updateContact } from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

import { parseFilterParams } from '../utils/parseFilterParams.js';

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
  const { _id: userId } = req.user;

  const contact = await deleteContact(contactId, userId); 

  if (!contact) {
    throw createHttpError(404, 'Contact  not found');
  }

  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
const { _id: userId } = req.user;

  const result = await updateContact(contactId, userId, req.body); 

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};





