
<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text
  }) 
%>
<%= renderer.include('block/signature.tpl') %>
