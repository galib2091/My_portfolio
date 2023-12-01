$(document).ready(function () {

  'use strict'

  var Nexus = {

    initialized: false,

    mainNavAnimated: (document.querySelector('[data-menuAnimated]').dataset.menuanimated === 'true') ? true : false,

    globalArgs: {
      mainNav: document.querySelector('.js-main-nav'),
      mainNavList: document.querySelector('.js-main-nav__list'),
      mainNavToggle: document.querySelector('.js-main-nav-toggle')
    },

    initialize: function(){
      if (this.initialized) return;

      this.initialized = true;
      this.build();
    },

    // Building all site functionality
    build: function(){
      this.mainMenuActions();
      this.cardModal();
      this.smoothScroll();
      this.tabs();
      this.validateForm();
      this.wow();
      this.runAnimations();
      (this.mainNavAnimated) ? this.fixedMenuScroll() : null;
      this.setMargins();
      this.showNavPosition();
    },

    showNavPosition: function(){

      var showerContent = {};
      var showerNavs = {};
      var navPosition = document.querySelectorAll('[data-navPosition]');
      var contentPosition = document.querySelectorAll('[data-contentPosition]');
      navPosition = Array.prototype.slice.call(navPosition, 0)
      contentPosition = Array.prototype.slice.call(contentPosition, 0)

      var prevActiveLink = $(navPosition[0]);

      for (var i = 0; i < navPosition.length; i++){
        showerContent[i] = contentPosition[i];
        showerNavs[i] = navPosition[i];
      }

      for (let item in showerContent){
        let value = $(showerContent[item]);
        let _item = $(showerNavs[item]);
        // var inview = new Waypoint.Inview({
        //   element: value,
        //   enter: function(direction) {
        //     console.log(value[0].id, 'enter ' + direction);
        //     // if (direction === 'down') {
        //     //   prevActiveLink.removeClass('active-link');
        //     //   _item.addClass('active-link');
        //     //   prevActiveLink = _item;
        //     // }
        //   },
        //   // entered: function(direction) {
        //   //   console.log(value[0].id , 'entered direction ' + direction)
        //   // },
        //   exit: function(direction) {
        //     console.log(value[0].id, 'exit ' + direction);
        //     // if (direction === 'up') {
        //     //   prevActiveLink.removeClass('active-link');
        //     //   _item.addClass('active-link');
        //     //   prevActiveLink = _item;
        //     // }
        //   },
        //   // exited: function(direction) {
        //   //   console.log(value[0].id , 'exited direction ' + direction)
        //   // },
        //   offset: 0
        // });
        value.waypoint({
          handler: function(direction) {
            prevActiveLink.removeClass('active-link');
            _item.addClass('active-link');
            prevActiveLink = _item;
          },
          offset: 0
        });
      }
    },

    setMargins: function() {
      const mainNavHeight = $('.js-main-nav').outerHeight(),
            mainFooterTop = $('.js-main-footer-top');

      mainFooterTop.css({'min-height': mainNavHeight});
    },

    // Animation on SVG icons
    runAnimations: function() {
      // Run animation when icon shows on bottom of window. 0.8 is approximate factor
      var offset = $(window).height() * 0.8;
      var svgIcons = $('.svg-icon');
      svgIcons.waypoint({
        handler: function() {
          this.element.classList.add('svg-icon--is-animated');
        },
        offset: offset
      });
    },

    wow: function() {
      var wow = new WOW(
      {
        boxClass:     'wow',      // default
        animateClass: 'animated', // default
        offset:       0,          // default
        mobile:       true,       // true
        live:         true        // true
      });
      wow.init();
    },

    validateForm: function() {
      Array.from(document.querySelectorAll('.js-form-validation .c-form__field')).forEach(item => {
        item.addEventListener('invalid', () => {
          item.dataset.touched = true
        });
        item.addEventListener('blur', () => {
          if (item.value !== '') item.dataset.touched = true
        });
      });
    },

    tabs: function() {

      var $this = this;
      var tabs = $('.js-tabs');

      function setTabMargin(){
        var tabsHeight = tabs.outerHeight();
        var currentContent = tabs.find('.c-tabs__content:visible');
        var currentContentHeight = currentContent.outerHeight();
        tabs.css({
          'margin-bottom': currentContentHeight
        });
        currentContent.css({
          'top': tabsHeight
        });
      }

      setTabMargin();

      tabs.on('click', function(event){
        setTabMargin();
      });
    },

    mainMenuActions: function() {
      var toggleMenu = this.globalArgs.mainNavToggle,
          mainNavList = this.globalArgs.mainNavList;

      toggleMenu.addEventListener('click', (event) => {
        mainNavList.classList.toggle('c-main-nav__list--is-visible');
        toggleMenu.classList.toggle('c-main-nav__bars--is-toggled');
      });
      mainNavList.addEventListener('click', (event) => {
        mainNavList.classList.toggle('c-main-nav__list--is-visible');
        toggleMenu.classList.toggle('c-main-nav__bars--is-toggled');
      });
    },

    toggleMainNav: function() {
      this.globalArgs.mainNavList.classList.toggle('c-main-nav__list--is-visible');
      this.globalArgs.mainNavToggle.classList.toggle('c-main-nav__bars--is-toggled');
    },

    cardModal: function() {
      var cardsContainer = $('.js-cards');
      cardsContainer.on('click', '.js-toggle-modal', function(event) {
        var cardItem = $(event.currentTarget);
        var button = cardItem.find('button[type=button]');
        var cardContent = cardItem.find('.js-card-content'),
            cardModal = cardItem.find('.js-card-modal-content');

        button.toggleClass('c-card__button-field--is-active');
        cardItem.toggleClass('c-card__item--modal');
        cardItem.toggleClass('c-card__item');
        cardContent.toggleClass('u-fade-out');
        cardModal.toggleClass('u-fade-in');
      });
    },

    fixedMenuScroll: function(externalCall) {

      var mainNav = this.globalArgs.mainNav,
          mainContainer = document.querySelector('.js-main-container'),
          containerMargin = 0,
          menuFixingPoint = $("#section-education"),
          menuFixingPointBottom = $(".js-main-footer"),
          mainFooterTop = $('.js-main-footer-top');

      var showTop = false,
          showBottom = false;
      var offset = $(window).height() * 0.3;

      function setNavRightPoisition(element, distance){
        let mainNav = $(element);
        containerMargin = mainContainer.getBoundingClientRect().left;
        mainNav.css({
          'padding-right': distance || containerMargin
        });
      }

      function setRightMenuPosition() {
        if (showTop){
          mainNav.classList.remove('nav-fixed--on-top');
          mainNav.classList.remove('nav-fixed--out');
          mainNav.classList.add('nav-fixed');
          // Set right position while fixed
          setNavRightPoisition(mainNav, undefined);
        } else {
          mainNav.classList.add('nav-fixed--out');
          // Set right position when UNfixed
          setNavRightPoisition(mainNav, 0.1);
        }
      }

      // Fixed to right
      menuFixingPoint.waypoint({
        handler: function(direction) {
          if (direction === 'down'){
            showTop = true;
            setRightMenuPosition();
          } else if (direction === 'up') {
            showTop = false;
            setRightMenuPosition();
          }
        },
        offset: offset
      });

      mainNav.addEventListener('transitionend', function(event){
        if (!showTop && event.propertyName === 'transform'){
          mainNav.classList.remove('nav-fixed');
          mainNav.classList.remove('nav-fixed--out');
          mainNav.classList.add('nav-fixed--on-top');
        }
      });

      //Fixed to bottom
      menuFixingPointBottom.waypoint({
        handler: function(direction) {
          if (externalCall) return;
          if (direction === 'down'){
            showBottom = true;
            setBottomMenuPosition();
          } else if (direction === 'up') {
            showBottom = false;
            setBottomMenuPosition();
          }
        },
        offset: 800
      });

      function setBottomMenuPosition() {
        let mainNavCopy = $(mainNav).clone();
        if (showBottom){
          mainFooterTop.append(mainNavCopy);
          mainNav.classList.add('nav-hidden-bottom')
          mainNavCopy.removeClass('nav-fixed');
          mainNavCopy.addClass('nav-fixed--on-bottom');
          mainNavCopy.find('.c-main-nav__link').removeClass('active-link')
          mainNavCopy.find('.c-main-nav__link').last().addClass('active-link')
          setNavRightPoisition(mainNavCopy, 0.1);
        } else {
          mainNav.classList.remove('nav-hidden-bottom')
          mainFooterTop.empty();
          setNavRightPoisition(mainNav, undefined);
        }
      }
    },

    smoothScroll: function() {
      var _this = this;
      $('a[href*="#"]:not([href="#"])').on('click', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
          _this.toggleMainNav();
          if (target.length) {
            $('html, body').animate({
              scrollTop: target.offset().top
            }, 500);
            return false;
          }
        }
      });
    }
  };

  Nexus.initialize();

  // On resize actions
  window.onresize = function(){
    Nexus.tabs();
    Nexus.fixedMenuScroll(true);
  }

});
