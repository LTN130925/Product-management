// Filter-Status

const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus) {
  let url = new URL(window.location.href);

  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      window.location.href = url.href;
    });
  });
}

// End Filter-Status

// Search-Item

const formSearch = document.querySelector("#form-search");

if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();

    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}

// End Search-Item

// Pagination-Page

const paginationButton = document.querySelectorAll("[button-pagination]");

if (paginationButton) {
  let url = new URL(window.location.href);

  paginationButton.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);

      window.location.href = url.href;
    });
  });
}

// End Pagination-Page

// Checkbox Multi

const checkboxMulti = document.querySelector("[checkbox-multi]");

if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {
    const resultChecked = inputCheckAll.checked;
    inputsId.forEach((input) => {
      input.checked = resultChecked;
    });
  });

  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;

      const resultInputsID = countChecked === inputsId.length;
      inputCheckAll.checked = resultInputsID;
    });
  });
}

// End Checkbox Multi

// Form Change Multi

const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = e.target.elements.type.value;

    const changeState =
      typeChange === "permanentlyDelete-all" ? "vĩnh viễn " : "";

    if (typeChange === "delete-all" || typeChange === "permanentlyDelete-all") {
      const isConfirm = confirm(
        `Bạn có chắc muốn xóa ${changeState}những sản phẩm này?`
      );

      if (!isConfirm) {
        return;
      }
    } else if (typeChange === "recovery-all") {
      const isConfirm = confirm(
        "Bạn có chắc muốn khôi phục những sản phẩm này?"
      );

      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        let id = input.value;

        if (typeChange === "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']");
          ids.push(`${id}-${position.value}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");

      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi!");
    }
  });
}

// End Form Change Multi

// Delete Item
// permanentlyDelete

const deleteItem = document.querySelector("[checkbox-multi]");

if (deleteItem) {
  const buttonItemDelete = deleteItem.querySelectorAll("[button-delete-item]");
  const formDeleteItem = document.querySelector("#form-delete-item");

  const path = formDeleteItem.getAttribute("data-path");

  buttonItemDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const changeState =
        path.split("/")[path.split("/").length - 1] === "permanentlyDelete"
          ? "vĩnh viễn "
          : "";

      const isConfirm = confirm(
        `bạn có chắc muốn xóa ${changeState}sản phẩm này?`
      );

      if (isConfirm) {
        const data_id = button.getAttribute("data-id");

        const action = path + `/${data_id}?_method=DELETE`;
        formDeleteItem.action = action;

        formDeleteItem.submit();
      }
    });
  });
}

// End Deleted Item
// End permanentlyDelete

// Show alert

const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
  const data_time = parseInt(showAlert.getAttribute("data-time"));

  const closeAlert = showAlert.querySelector("[close-alert]");

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, data_time);
}

// End Show alert

// updateQueryParams

const updateQueryParams = (key, value) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.location.href = url.href;
};

// End updateQueryParams

// Upload img

const uploadImg = document.querySelector("[upload-image]");

if (uploadImg) {
  const previewImg = uploadImg.querySelector("[upload-image-preview]");
  const inputImg = uploadImg.querySelector("[upload-image-input]");
  const buttonRemove = uploadImg.querySelector("[button-remove-image]");

  inputImg.addEventListener("change", (e) => {
    const [file] = e.target.files;
    if (file) {
      previewImg.src = URL.createObjectURL(file);
      buttonRemove.style.display = "inline-block";
    }
  });

  buttonRemove.addEventListener("click", () => {
    inputImg.value = "";
    previewImg.src = "";
    buttonRemove.style.display = "none";
  });
}

// End upload img

