<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text:message
  }) 
%>


<%= renderer.include('block/system-message-red.tpl', {
    text:reason
  }) 
%>

<%= renderer.include('block/signature.tpl') %>