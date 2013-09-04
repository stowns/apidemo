require 'rubygems'
require 'ffi-rzmq'
require 'json'

context = ZMQ::Context.new
socket = context.socket(ZMQ::REP)
socket.bind('tcp://*:5563')

loop do
  socket.recv_string(message = '')
  puts "Received request: #{message}"
  res = { "data" => "data from service_3 on process: #{Process.pid} (ruby)" }
  socket.send_string(JSON.dump(res))
end