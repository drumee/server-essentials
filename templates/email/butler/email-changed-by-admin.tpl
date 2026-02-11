<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:_email_changed_by_x_admin.format(domain)
  }) 
%>
<%= renderer.include('block/link.tpl', {label:lex._mail_validate_newmail}) %>
<%= renderer.include('block/signature.tpl') %>
