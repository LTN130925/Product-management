const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const filterSort = require("../../helper/filterSort");
const createTreeHelper = require("../../helper/create-tree");

const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const filterStatus = filterStatusHelper(req.query, find);

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const countProduct = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      limitItem: req.query.limit || 4,
      currentPage: 1,
    },
    req.query,
    countProduct
  );

  const views = filterSort(req.query);

  const products = await Product.find(find)
    .sort(views)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.render("admin/pages/product/index", {
    pageTitle: "Trang quản lý sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [DELETE] /admin/products/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const objectParams = {
    id: req.params.id,
  };

  const { id } = objectParams;

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );

  req.flash("success", "Xóa sản phẩm thành công!");

  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  const record = await ProductCategory.find(find);
  const category = createTreeHelper.tree(record);

  res.render("admin/pages/product/create", {
    pageTitle: "Trang thêm mới sản phẩm",
    category: category,
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  const body = req.body;

  const objectBody = {
    title: body.title,
    product_category_id: body.product_category_id,
    description: body.description,
    price: +body.price,
    discountPercentage: +body.discountPercentage,
    stock: +body.stock,
    thumbnail: body.thumbnail,
    status: body.status,
    position: body.position,
  };

  if (objectBody.position === "") {
    const countProduct = await Product.countDocuments();
    const count = countProduct + 1;
    objectBody.position = count;
  } else {
    objectBody.position = +objectBody.position;
  }

  const products = new Product(objectBody);
  await products.save();

  req.flash("success", "Tạo sản phẩm thành công!");

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    let find = {
      _id: req.params.id,
      deleted: false,
    };

    const productCategory = await ProductCategory.find({ deleted: false });
    const category = createTreeHelper.tree(productCategory);
    const product = await Product.findOne(find);

    res.render("admin/pages/product/edit", {
      pageTitle: "Trang chỉnh sửa sản phẩm",
      product: product,
      category: category,
    });
  } catch (error) {
    req.flash("error", "Lỗi id!");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const body = req.body;

  const objectBody = {
    title: body.title,
    product_category_id: body.product_category_id,
    description: body.description,
    price: +body.price,
    discountPercentage: +body.discountPercentage,
    stock: +body.stock,
    thumbnail: body.thumbnail,
    status: body.status,
    position: body.position,
  };

  objectBody.position = body.position === "" ? 0 : +objectBody.position;

  try {
    await Product.updateOne(
      {
        _id: req.params.id,
      },
      objectBody
    );
    req.flash("success", "cập nhật sản phẩm thành công!");
  } catch (error) {
    req.flash("error", "cập nhật sản phẩm thất bại!");
  }

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/trashCan
module.exports.trash = async (req, res) => {
  let find = {
    deleted: true,
  };

  const filterStatus = filterStatusHelper(req.query, find);

  const objectSearch = searchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const countProduct = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      limitItem: req.query.limit || 4,
      currentPage: 1,
    },
    req.query,
    countProduct
  );

  const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.render("admin/pages/product/trashCanProducts", {
    pageTitle: "Thùng rác sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/trashCan/recovery/:id
module.exports.recovery = async (req, res) => {
  const objectParams = {
    id: req.params.id,
  };

  const { id } = objectParams;

  await Product.updateOne({ _id: id }, { deleted: false });

  req.flash("success", "Khôi phục sản phẩm thành công!");

  res.redirect(req.get("Referrer") || "/");
};

// [DELETE] /admin/products/trashCan/permanentlyDelete/:id
module.exports.permanentlyDelete = async (req, res) => {
  const objectParams = {
    id: req.params.id,
  };

  const { id } = objectParams;

  await Product.deleteOne({ _id: id });

  req.flash("success", "Xóa vĩnh viễn sản phẩm thành công!");

  res.redirect(req.get("Referrer") || "/");
};

// [PATCH] /admin/products/trashCan/change-status/:status/:id
// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const objectParams = {
    status: req.params.status,
    id: req.params.id,
  };

  const { status, id } = objectParams;

  await Product.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái sản phẩm thành công!");

  res.redirect(req.get("Referrer") || "/");
};

// [PATCH] /admin/products/trashCan/change-multi
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const objectBody = {
    id: req.body.ids.split(", "),
    status: req.body.type,
  };

  const { id, status } = objectBody;

  switch (status) {
    case "active":
      await Product.updateMany(
        { _id: { $in: id } },
        {
          status: "active",
        }
      );

      req.flash(
        "success",
        `Cập nhật trang thái ${id.length} sản phẩm thành công!`
      );

      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: id } },
        {
          status: "inactive",
        }
      );

      req.flash(
        "success",
        `Cập nhật trang thái ${id.length} sản phẩm thành công!`
      );

      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: id } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );

      req.flash("success", `Xóa ${id.length} sản phẩm thành công!`);

      break;
    case "permanentlyDelete-all":
      await Product.deleteMany({ _id: { $in: id } });

      req.flash("success", `Xóa vĩnh viễn ${id.length} sản phẩm thành công!`);

      break;
    case "change-position":
      for (const item of id) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          { _id: id },
          {
            position: position,
          }
        );
      }

      req.flash("success", `Cập nhật vị trí ${id.length} sản phẩm thành công!`);

      break;
    case "recovery-all":
      await Product.updateMany(
        { _id: { $in: id } },
        {
          deleted: false,
        }
      );

      req.flash("success", `Khôi phục ${id.length} sản phẩm thành công!`);

      break;
    default:
      break;
  }

  res.redirect(req.get("Referrer") || "/");
};

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  const product = await Product.findOne(find);

  product.newPrice = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(2);

  res.render("admin/pages/product/detail", {
    titlePage: product.title,
    product: product,
  });
};
