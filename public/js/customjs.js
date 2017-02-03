$(document).ready(function () {
   $('.head_chat_box ul li.pull-right').click(function () {
        $('.box_chat').hide();
   });

   $('#list_friend li').click(function () {
       var username = $(this).text();
       $('.head_chat_box .name_chat_with').text(username);
       $('.box_chat').show();
   });
});