<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text: lex._mail_you_resquest_change_email
  }) 
%>
<%= renderer.include('block/link.tpl', {label: lex._mail_validate_this_email}) %>
<%= renderer.include('block/signature.tpl') %>
