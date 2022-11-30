const router = require('express').Router();
const { restart } = require('nodemon');
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const allCategories = await Category.findAll({
      attributes: ["id", "category_name"],
      // be sure to include its associated Products
      include: [
        {
          model: Product, 
          attributes: ["id", "product_name", "price", "stock", "category_id"],
        },
      ]
    });
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {
    const categoryId = await Category.findOne({
      // be sure to include its associated Products
      where: { id: req.params.id },
      include: [{
        model: Product, 
        attributes: ["id", "product_name", "price", "stock", "category_id"],
      }]
    });
    if (!categoryId) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }
    res.status(200).json(categoryId);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update({
    category_name: req.body.category_name,
  },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then((updatedCategory) => {
    res.json(updatedCategory);
  })
    .catch((err) => res.json(err));
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const deletedCategory = await Category.destroy({
      where: { id: req.params.id }
    });
    if (!deletedCategory) {
      res.status(404).json({ message: "No category with this id!" });
      return;
    }
    res.status(200).json(deletedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
