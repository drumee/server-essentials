
<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:_your_otp_is_x.format(code)
  }) 
%>
<%= renderer.include('block/signature.tpl') %>
