const { v4 } = require('uuid');
const { CustomError } = require('../CustomError');
const Logger = require('../Logger');
const { slugify } = require('../slugify');
const Comment = require('../Comment');
const db = require('../db');
const Status = require('../Status');

class Application {
  static async getAll() {
    const applicationsData = await db.applications.getAll();
    const applicationsExended = Promise.all(applicationsData.map((data) => new Application(data)).map(async (application) => {
      const status = await Status.findById(application.statusId);
      application.setStatus(status);
      return application;
    }));
    return applicationsExended;
  }

  static async getBySlug(slug) {
    const applicationData = await db.applications.getBySlug(slug);
    if (!applicationData) {
      throw new CustomError(`Application with slug ${slug}, not found`, 404);
    }
    const application = new Application(applicationData);
    const status = await Status.findById(application.statusId);
    application.setStatus(status);
    const comments = await Comment.getByApplicationId(application.id);
    application.setComments(comments);
    return application;
  }

  static async getById(id) {
    const applicationData = await db.applications.getById(id);
    if (!applicationData) {
      throw new CustomError(`Application with id ${id}, not found`, 404);
    }
    const application = new Application(applicationData);
    const status = await Status.findById(application.statusId);
    application.setStatus(status);
    return application;
  }

  static async createNewSlug(company, position, index) {
    const companySlug = slugify(company);
    const positionSlug = slugify(position);
    const newSlug = index === undefined ? `${companySlug}-${positionSlug}` : `${companySlug}-${positionSlug}-${index}`;
    const application = await db.applications.getBySlug(newSlug);
    if (application) {
      const nextIndex = index === undefined ? 1 : index + 1;
      return Application.createNewSlug(company, position, nextIndex);
    }
    return newSlug;
  }

  static async create({ company, position, link, description, createdAt }) {
    // no checks of incoming data
    try {
      const defaultStatus = await Status.defaultStatus();
      const slug = await Application.createNewSlug(company, position);
      const newApplicationData = {
        id: v4(),
        company,
        position,
        slug,
        link,
        description,
        statusId: defaultStatus.id,
        createdAt,
      }
      await db.applications.create(newApplicationData);
      const newApplication = new Application(newApplicationData);
      newApplication.setStatus(defaultStatus);
      return newApplication;
    } catch (error) {
      Logger.logError('Error creating application in DB', error);
      throw new CustomError('Sorry, application could not be created. Try again in a few moments.', 500);;
    }
  }

  constructor({ id, company, position, link, description, statusId, createdAt, slug }) {
    this.id = id;
    this.company = company;
    this.position = position;
    this.link = link;
    this.description = description;
    this.statusId = statusId;
    this.createdAt = createdAt;
    this.slug = slug;
  }

  setComments(comments) {
    this.comments = comments;
  }

  setStatus(status) {
    this.status = status;
  }

  async update({ company, position, link, description, statusId }) {
    // no check of data
    try {
      await db.applications.update(this.id, {
        company,
        position,
        link,
        description,
        statusId,
        id: this.id,
        createdAt: this.createdAt,
        slug: this.slug,
      });
      this.company = company;
      this.position = position;
      this.link = link;
      this.description = description;
      this.statusId = statusId;
    } catch (error) {
      Logger.logError('Error updating application in DB', error);
      throw new CustomError('Sorry, application could not be updated. Try again in a few moments.', 500);;
    }
  }

  toJSON() {
    return {
      id: this.id,
      company: this.company,
      position: this.position,
      link: this.link,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      slug: this.slug,
      comments: this.comments,
    };
  }
}

module.exports = Application;
