class BlogDTO {
  constructor(blog) {
    this._id = blog._id;
    (this.title = blog.title),
      (this.content = blog.content),
      (this.auther = blog.auther),
      (this.photo = blog.photo);
  }
}

module.exports = BlogDTO;
