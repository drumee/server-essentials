<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/subject.tpl') %>
<% if(_.isEmpty(message) || message == "") { %>
  <div class="drumee-no-message-me"></div>
<% }else{ %>
  <div class="drumee-message-me-container">
    <div class="drumee-message-me" style="font-family: Calibri;font-size: 16px;">
      <p><%= message %></p>
    </div>
  </div>
<% } %>
<%= renderer.include('block/link.tpl', {label: _open_the_mailbox}) %>
<%= renderer.include('block/signature.tpl') %>
