<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:_download_link_ready
  }) 
%>
<%= renderer.include('block/raw-link.tpl') %>
<%= renderer.include('block/signature.tpl') %>
