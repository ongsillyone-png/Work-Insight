const categoryRepository = require('../repositories/category.repository');

class CategoryService {
  async getAllCategories() {
    return categoryRepository.findAll();
  }

  async getCategoryById(id) {
    return categoryRepository.findById(id);
  }

  async createCategory(data) {
    return categoryRepository.create(data);
  }

  async updateCategory(id, data) {
    return categoryRepository.update(id, data);
  }

  async deleteCategory(id) {
    return categoryRepository.delete(id);
  }
}

module.exports = new CategoryService();
