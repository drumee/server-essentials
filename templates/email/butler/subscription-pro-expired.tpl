<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text:message
  }) 
%>

<%= renderer.include('block/link.tpl', {link:redirect_link, label: label}) %>
<%= renderer.include('block/signature.tpl') %>