'use strict';

const articleView = {};

articleView.populateFilters = () => {
  $('article').each(function () {
    if (!$(this).hasClass('template')) {
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function () {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function () {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('.main-nav').on('click', '.tab', function (e) {
    e.preventDefault();
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function (e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      }, 200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENT: When/where is this function invoked? What event ultimately triggers its execution? Explain the sequence of code execution when this function is invoked.
// this function is being invoked at the bottom of this js page to ensure that the logic is not fired until everything else is run through it. this function is fired first, then we are itterating through the array of articles from the provided data and appending them to the html. After that function has run, we call the populateFilters to make sure that our category and author dropdown menus has stuff interactable for the user to be able to actually filter (both category and author filters reference the filter function, hence it being there first). then the nav bar is being rendered to work. and finally the teaser text with user option to expand and contract is being called.
articleView.initNewArticlePage = () => {
  $('.tab-content').show();
  $('#export-field').hide();
  $('#article-json').on('focus', function () {
    this.select();
  });

  $('#new-form').on('change', 'input, textarea', articleView.create);
  $('#new-form').on('submit', articleView.submit);
};

// COMMENT: When is this function called? What event ultimately triggers its execution?
// the initNemArticlePage hold a callback to this for the user's article to be constructed and then later rendered on the index.html page
articleView.create = () => {
  let article;
  $('#articles').empty();

  article = new Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? new Date() : null
  });

  $('#articles').append(article.toHtml());

  $('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
  });

  $('#export-field').show();
  $('#article-json').val(`${JSON.stringify(article)},`);
};

// COMMENT: When is this function called? What event ultimately triggers its execution?
// the initNemArticlePage hold a callback to this for the user's article to be constructed and then later rendered on the index.html page. the submit is what really connects the user's input into the index.html page through local storage.
articleView.submit = event => {
  event.preventDefault();
  let article = new Article({
    title: $('#article-title').val(),
    author: $('#article-author').val(),
    authorUrl: $('#article-author-url').val(),
    category: $('#article-category').val(),
    body: $('#article-body').val(),
    publishedOn: $('#article-published:checked').length ? new Date() : null
  });

  // COMMENT: Where is this function defined? When is this function called? What event ultimately triggers its execution?
  // This function is defined in article.js. It's called when the user hits the submit button.
  article.insertRecord();
};

articleView.initIndexPage = () => {
  Article.all.forEach(article => {
    $('#articles').append(article.toHtml());
  });

  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
