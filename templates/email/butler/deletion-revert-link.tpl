<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text:_email_account_deletion_confirm
  }) 
%>
<%= renderer.include('block/system-message-red.tpl', {
    text:date
  }) 
%>
<%= renderer.include('block/system-message.tpl', {
    text:_account_restore_tips
  }) 
%>

<%= renderer.include('block/raw-link.tpl') %>

<%= renderer.include('block/system-message.tpl', {
    text:_hoping_see_you_soon
  }) 
%>

<%= renderer.include('block/signature.tpl') %>
