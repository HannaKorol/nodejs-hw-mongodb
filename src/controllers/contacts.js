import createHttpError from 'http-errors';

import { deleteContact } from '../services/contacts.js';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { createContact } from '../services/contacts.js';
import { updateContact } from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  try {
    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
    });

    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params; // Extract contactId from params
  const contact = await getContactById(contactId);
  console.log(req.params);

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
    const contact = await createContact(req.body);

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
        next(createHttpError(404, "Contact  not found"));
        return;
    }

    res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);

    if (!result) {
        next(createHttpError(404, 'Contact not found'));
        return;
    }

    res.json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: result.contact,
    });
};





