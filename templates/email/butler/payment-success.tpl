<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text: lex._renewal_succeed_message
  }) 
%>

<%= renderer.include('block/link.tpl', {link:redirect_link, label: lex._open_my_desktop}) %>
<%= renderer.include('block/signature.tpl') %>