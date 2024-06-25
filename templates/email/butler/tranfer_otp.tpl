<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:message
  }) 
%>
<%= renderer.include('block/signature.tpl') %>
