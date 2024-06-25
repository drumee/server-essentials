<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
  text:_mail_signup_drumee
  })
%>

<%= renderer.include('block/link.tpl', {label: _mail_access_drumee}) %>
<%= renderer.include('block/signature.tpl') %>
